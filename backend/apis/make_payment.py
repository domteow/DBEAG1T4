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
loan_request_URL = environ.get('loan_request_URL') or "http://localhost:5006/loanrequest/get/" # + loan request id
notification_URL = environ.get('notification_URL') or "http://localhost:5002/notification/" # + sendSMS or sendemail

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

    def calculate_monthly_installment(loan_amount, annual_interest_rate, maturity_date_str):
        maturity_date = datetime.datetime.strptime(maturity_date_str, '%Y-%m-%d')
        n = (maturity_date.year - datetime.datetime.now().year) * 12 + (maturity_date.month - datetime.datetime.now().month)
        r = annual_interest_rate / 12
        M = loan_amount * (r * (1 + r) ** n) / ((1 + r) ** n - 1)
        return M



    # 1. Get payer_id, loan_request_id, payee account number, payment amt, interest rate
    data = request.get_json()
    payer_id = data['userID']
    PIN = data['PIN']
    OTP = data['OTP']
    payee_account_id = data['payee_accountID']
    loan_request_id = data['loan_request_id']
    payment_with_commission = data['payment_amount']
    annual_interest_rate = data['annual_interest_rate']
    commission = payment_with_commission * 0.01
    payment_amount = payment_with_commission - commission

    

    # 2a. Get payer bank account id using payer id
    account_requestObj = {
        "Header" : {
            "serviceName" : "getCustomerAccounts",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        }
    }

    account_response = requests.post(customer_URL + "getaccounts", json=account_requestObj)
    if account_response.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Failed to get payer account details'
            } 
        )
    payer_account_details = account_response.json()['data']['Content']['ServiceResponse']['AccountList']
    payer_account_id = payer_account_details["account"]["accountID"]
    payer_account_id = payer_account_id.lstrip("0")

    # 2b. Get payer customer details using payer id

    details_requestObj = {
        "Header" : {
            "serviceName" : "getCustomerDetails",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        }
    }
    payer_customer_details = requests.post(customer_URL + "getdetails", json=details_requestObj)
    if payer_customer_details.json()['code'] >= 400:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Failed to get payer customer details'
            } 
        )
    payer_customer_details = payer_customer_details.json()['data']['Content']['ServiceResponse']['CDMCustomer']
    payer_email = payer_customer_details['profile']['email']
    payer_phone = payer_customer_details['phone']['countryCode'] + payer_customer_details['phone']['localNumber']
    
    
    # 3. get data from Loan Request DB
    loan_request_response = requests.get(loan_request_URL + loan_request_id)

    if 300 > loan_request_data.json()['code'] > 200:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Failed to get loan request details'
            } 
        )
    
    loan_request_data = loan_request_response.json()['data']


    # 4. Check if loan request is still open and valid
    if loan_request_data['amount_left'] < payment_amount:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Payment amount is more than amount left'
            } 
        )
    
    elif loan_request_data['amount_left'] <= 0 :
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Amount is 0 or negative or null'
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
    
    

    # 5. Make payment
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
                'message': 'Failed to make payment'
            } 
        )
    
    # 6. Edit Loan Request in DB

    # Lender to Borrower (sends full principal amount)
    if loan_request_data['status'] == "request":
        loan_request_data['lender_id'] = payer_id
        monthly_installment = calculate_monthly_installment(payment_amount, loan_request_data['interest_rate'], loan_request_data['maturity_date'])
        loan_request_data['monthly_installment'] = monthly_installment
        loan_request_data['amount_left'] = loan_request_data['loan_amount']
        loan_request_data['status'] = "active"
        update_loan_request = requests.put(loan_request_URL + loan_request_id, json=loan_request_data)
        

    # Borrower to Lender (sends monthly installment)
    elif loan_request_data['status'] == "active":
        loan_request_data['amount_left'] -= payment_amount

        if loan_request_data['amount_left'] <= 0:
            loan_request_data['status'] = "closed"
        update_loan_request = requests.put(loan_request_URL + loan_request_id, json=loan_request_data)


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
            "emailBody" : "You have successfully made a payment of $" + str(payment_amount) + " to " + str(payee_account_id)
        }
    }

    email_response = requests.post(notification_URL + "sendemail", json=email_requestObj)


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
            "message" : "You have successfully made a payment of $" + str(payment_amount) + " to " + str(payee_account_id)
        }
    }

    sms_response = requests.post(notification_URL + "sendsms", json=sms_requestObj)

    # 8. Log transaction

    # transaction_requestObj = {
    #     "amount" : payment_amount,






    

        
    



    










if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for making a payment...")
    app.run(host="0.0.0.0", port=5300, debug=True)