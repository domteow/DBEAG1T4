from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
import json
import datetime

app = Flask(__name__)
CORS(app)

payment_URL = environ.get('payment_URL') or "http://localhost:5003/payment/credittransfer" 
transaction_URL = environ.get('transaction_URL') or "http://localhost:5004/transaction/"
customer_URL = environ.get('customer_URL') or "http://localhost:5001/customer/"
loan_request_URL = environ.get('loan_request_URL') or "http://localhost:5006/loanrequest/" # + loan request id
notification_URL = environ.get('notification_URL') or "http://localhost:5002/notification/" # + sendSMS or sendemail
beneficiary_URL = environ.get('beneficiary_URL') or "http://localhost:5007/beneficiary/" # + add

@app.route("/make_payment", methods=['POST'])
def make_payment():
    """
    Make payment
    -> take in payer_id, loan_request_id, payee_account_id
    -> get lender account num by lender_id
    -> update row in loan_request (add in lender_id, monthly_installment, amount_left, update "status)
    -> use payment to transfer money
    -> use transaction to keep record
    """

    # def calculate_monthly_installment(loan_amount, annual_interest_rate, maturity_date_str):
    #     maturity_date = datetime.datetime.strptime(maturity_date_str, '%Y-%m-%d')
    #     n = (maturity_date.year - datetime.datetime.now().year) * 12 + (maturity_date.month - datetime.datetime.now().month)
    #     r = annual_interest_rate / 12
    #     M = loan_amount * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
    #     return M



    # 1. Get payer_id, loan_request_id, payee account number, payment amt, interest rate
    data = request.get_json()
    payer_id = data['userID']
    PIN = data['PIN']
    OTP = data['OTP']
    payer_account_id = data['payer_accountID']
    payee_account_id = data['payee_accountID']
    loan_request_id = data['loan_request_id']
    # principal = data['principal']
    # payment_with_commission = data['payment_amount']
    # annual_interest_rate = data['annual_interest_rate'] / 100
    # commission = payment_with_commission * 0.01
    # payment_amount = payment_with_commission - commission
    commission = data['commission']
    payment_amount = data['payment_amount']

    payer_name = data['payer_name']
    payer_nationality = data['payer_nationality']
    payer_occupation = data['payer_occupation']
    payer_type = data['payer_type']
    payer_email = data['payer_email']
    payer_phone = data['payer_phone']



    # 2. Get payer customer details using payer id

    # details_requestObj = {
    #     "Header" : {
    #         "serviceName" : "getCustomerDetails",
    #         "userID" : payer_id,
    #         "PIN" : PIN,
    #         "OTP" : OTP
    #     }
    # }
    # payer_customer_details = requests.post(customer_URL + "getdetails", json=details_requestObj)
    # if payer_customer_details.json()['code'] >= 400:
    #     return jsonify(
    #         {
    #             "code": 500,
    #             "data": {},
    #             'message': 'Failed to get payer customer details'
    #         } 
    #     )
    # payer_customer_details = payer_customer_details.json()['data']['Content']['ServiceResponse']['CDMCustomer']
    # payer_email = payer_customer_details['profile']['email']
    # payer_phone = str(payer_customer_details['cellphone']['countryCode']) + str(payer_customer_details['cellphone']['phoneNumber'])
    
    
    # 3. get data from Loan Request DB
    loan_request_response = requests.get(loan_request_URL + "get/" + str(loan_request_id))

    if loan_request_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Failed to get loan request details'
            } 
        )
    
    loan_request_data = loan_request_response.json()['data']


    # 4. Check if loan request is still open and valid
    if  loan_request_data['status'] == "active" and loan_request_data['amount_left'] <= 0:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Amount is 0 or negative'
            } 
        )
    elif loan_request_data['status'] == "active" and loan_request_data['amount_left'] < payment_amount:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Payment amount is more than amount left'
            } 
        )
    
    elif loan_request_data['status'] == "closed":
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Loan request is closed'
            } 
        )
    
    
    
    # 5. Edit Loan Request in DB

    # Lender to Borrower (sends full principal amount + interest)
    if loan_request_data['status'] == "request":
        loan_request_data['lender_id'] = payer_id

        transaction_payer = payer_id
        transaction_payee = loan_request_data['borrower_id']
        transaction_reason = "Start of Loan"

        # monthly_installment = calculate_monthly_installment(payment_amount, loan_request_data['interest_rate'], loan_request_data['maturity_date'])
        
        # loan_request_data['monthly_installment'] = monthly_installment
        loan_request_data['lender_name'] = payer_name
        loan_request_data['lender_nationality'] = payer_nationality
        loan_request_data['lender_occupation'] = payer_occupation
        loan_request_data['lender_type'] = payer_type
        loan_request_data['lender_account_num'] = payer_account_id
        loan_request_data['amount_left'] = payment_amount
        loan_request_data['status'] = "active"
        payee_name = loan_request_data['borrower_name']
        payee_email = loan_request_data['borrower_email']
        payee_phone = loan_request_data['borrower_phone']
        
        update_loan_request = requests.put(loan_request_URL + "update/" + str(loan_request_id), json=loan_request_data)
        if update_loan_request.json()['code'] >= 400:
            return jsonify(
                {
                    "code": 500,
                    "data": update_loan_request.json(),
                    'message': 'Failed to update loan request'
                } 
            )

    # Borrower to Lender (repayment)
    elif loan_request_data['status'] == "active":

        # handle loan already funded
        if payer_id == loan_request_data['lender_id']:
            return jsonify(
                {
                    "code": 500,
                    "data": {},
                    'message': 'Loan already funded'
                } 
            )

        loan_request_data['amount_left'] -= payment_amount

        if loan_request_data['amount_left'] <= 0:
            loan_request_data['status'] = "closed"

        transaction_payer = payer_id
        transaction_payee = loan_request_data['lender_id']
        transaction_reason = "Repayment"
        payee_name = loan_request_data['lender_name']
        payee_email = loan_request_data['lender_email']
        payee_phone = loan_request_data['lender_phone']
        payer_email = loan_request_data['borrower_email']
        payer_phone = loan_request_data['borrower_phone']

        # change date of next repayment to next month

        # Convert the current repayment date string to a tuple of year, month, and day
        year, month, day = map(int, loan_request_data['date_of_next_repayment'].split('-'))

        # Increment the month by 1
        if month == 12:
            year += 1
            month = 1
        else:
            month += 1

        # Format the resulting year, month, and day back into a string
        loan_request_data['date_of_next_repayment'] = f"{year:04d}-{month:02d}-{day:02d}"



        update_loan_request = requests.put(loan_request_URL + "update/" + str(loan_request_id), json=loan_request_data)
        
        
        if update_loan_request.json()['code'] >= 400:
            return jsonify(
                {
                    "code": 500,
                    "data": update_loan_request.json(),
                    'message': 'Failed to update loan request'
                } 
            )
        
    # 6a. Add payee to beneficiary list in tBank
    beneficiary_requestObj = {
        "Header" : {
            "serviceName" : "addBeneficiary",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        },

        "Content" : {
            "AccountID" : payee_account_id,
            "Description" : payee_name
        }
    }
    add_beneficiary_response = requests.post(beneficiary_URL + "add", json=beneficiary_requestObj)
    if add_beneficiary_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": add_beneficiary_response.json(),
                'message': 'Failed to add beneficiary'
            } 
        )
    
    # 6b. Add commission bank account to beneficiary list in tBank
    beneficiary_requestObj = {
        "Header" : {
            "serviceName" : "addBeneficiary",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        },

        "Content" : {
            "AccountID" : "9997",
            "Description" : "Kelvin (Commission)"
        }
    }
    add_beneficiary_response = requests.post(beneficiary_URL + "add", json=beneficiary_requestObj)
    if add_beneficiary_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": add_beneficiary_response.json(),
                'message': 'Failed to add beneficiary'
            } 
        )

    # 7a. Send email to payer
    email_requestObj = {
        "Header" : {
            "serviceName" : "sendEmail",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        },

        "Content" : {
            "emailAddress" : payer_email,
            "emailSubject" : "Payment Successful",
            "emailBody" : "You have successfully made a payment of $" + str(payment_amount) + " to " + str(payee_name)
        }
    }

    email_response = requests.post(notification_URL + "sendemail", json=email_requestObj)
    if email_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": email_response.json(),
                'message': 'Failed to send email to payer'
            } 
        )

    # 7b. Send sms to payer

    sms_requestObj = {
        "Header" : {
            "serviceName" : "sendSMS",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        },

        "Content" : {
            "mobileNumber" : payer_phone,
            "message" : "You have successfully made a payment of $" + str(payment_amount) + " to " + str(payee_name)
        }
    }

    sms_response = requests.post(notification_URL + "sendSMS", json=sms_requestObj)
    if sms_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": sms_response.json(),
                'message': 'Failed to send sms to payer',
                'phone': payer_phone
            } 
        )
    
    # 7c. Send email to payee
    email_requestObj = {
        "Header" : {
            "serviceName" : "sendEmail",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        },

        "Content" : {
            "emailAddress" : payee_email,
            "emailSubject" : "Payment Successful",
            "emailBody" : "You have received a payment of $" + str(payment_amount) + " from " + str(payer_name)
        }
    }

    email_response = requests.post(notification_URL + "sendemail", json=email_requestObj)
    if email_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": email_response.json(),
                'message': 'Failed to send email to payee'
            } 
        )


    # 7d. Send SMS to payee
    sms_requestObj = {
        "Header" : {
            "serviceName" : "sendSMS",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        },

        "Content" : {
            "mobileNumber" : payee_phone,
            "message" : "You have received a payment of $" + str(payment_amount) + " from " + str(payer_name)
        }
    }

    sms_response = requests.post(notification_URL + "sendSMS", json=sms_requestObj)
    if sms_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": sms_response.json(),
                'message': 'Failed to send sms to payee',
                'phone': payee_phone
            } 
        )
    

    # 8. Log transaction

    # for repayment/loan transaction
    transaction_requestObj = {
        "amount" : payment_amount,
        "payer_id" : transaction_payer,
        "payee_id" : transaction_payee,
        "reason" : transaction_reason,
        "transaction_date" : datetime.datetime.now().date().strftime("%Y-%m-%d")

    }

    transaction_response = requests.post(transaction_URL + "create", json=transaction_requestObj)

    if transaction_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": transaction_response.json(),
                'message': 'Failed to log payment transaction'
            } 
        )
    
    # for commission transaction
    transaction_requestObj = {
            "amount" : commission,
            "payer_id" : transaction_payer,
            "payee_id" : "Jien",
            "reason" : "Commission",
            "transaction_date" : datetime.datetime.now().date().strftime("%Y-%m-%d")

        }

    transaction_response = requests.post(transaction_URL + "create", json=transaction_requestObj)

    if transaction_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": transaction_response.json(),
                'message': 'Failed to log commission transaction'
            } 
        )

    # 9. Make payment

    # Loan/Repayment
    payment_requestObj = {
                "Header" : {
                    "serviceName" : "creditTransfer",
                    "userID" : payer_id,
                    "PIN" : PIN,
                    "OTP" : OTP
                },

                "Content" : {
                    "accountFrom" : payer_account_id,
                    "accountTo" : payee_account_id,
                    "transactionAmount" : payment_amount
                }
            }
    
    payment_response = requests.post(payment_URL, json=payment_requestObj)
    if payment_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": payment_response.json(),
                'message': f'Failed to make payment to {payee_account_id}'
            } 
        )
    

    # Commission
    commission_account_id = "9997"
    payment_requestObj = {
                "Header" : {
                    "serviceName" : "creditTransfer",
                    "userID" : payer_id,
                    "PIN" : PIN,
                    "OTP" : OTP
                },

                "Content" : {
                    "accountFrom" : payer_account_id,
                    "accountTo" : commission_account_id,
                    "transactionAmount" : commission
                }
            }
    
    payment_response = requests.post(payment_URL, json=payment_requestObj)
    if payment_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": payment_response.json(),
                'message': 'Failed to pay commission'
            } 
        )
    return jsonify(
        {
            "code": 200,
            "data": payment_response.json(),
            'message': 'Payment successful'
        }
    )







    

        
    



    










if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for making a payment...")
    app.run(host="0.0.0.0", port=5300, debug=True)