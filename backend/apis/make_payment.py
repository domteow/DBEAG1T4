from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

payment_URL = environ.get('payment_URL') or "http://localhost:5003/payment/credittransfer" 
transaction_URL = environ.get('transaction_URL') or "http://localhost:5004/transaction"
customer_URL = environ.get('customer_URL') or "http://localhost:5001/customer/getaccounts"
loan_request_URL = environ.get('loan_request_URL') or "http://localhost:5006/loanrequest/get/" # + loan request id
notification_URL = environ.get('notification_URL') or "http://localhost:5002/notification" # + sendSMS or sendemail

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
        maturity_date = datetime.strptime(maturity_date_str, '%Y-%m-%d')

        monthly_interest_rate = annual_interest_rate / 12

        n = (maturity_date.year - datetime.now().year) * 12 + (maturity_date.month - datetime.now().month)
        
        monthly_installment = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate) ** n) / ((1 + monthly_interest_rate) ** n - 1)
        
        return monthly_installment



    # 1. Get payer_id, loan_request_id, payee_id, payment amt
    data = request.get_json()
    payer_id = data['Header']['userID']
    PIN = data['Header']['PIN']
    OTP = data['Header']['OTP']
    payee_account_id = data['Content']['accountID']
    loan_request_id = data['Content']['loan_request_id']
    payment_with_commission = data['Content']['payment_amount']
    commission = payment_with_commission * 0.01
    payment_amount = payment_with_commission - commission

    

    # 2. Get payer account id using payer id
    payer_headerObj = {
        "Header" : {
            "serviceName" : "getCustomerAccounts",
            "userID" : payer_id,
            "PIN" : PIN,
            "OTP" : OTP
        }
    }

    payer_response = requests.post(customer_URL, json=payer_headerObj)
    if 300 > payer_response.json()['code'] > 200:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Failed to get payer account details'
            } 
        )
    payer_account_details = payer_response.json()['data']['Content']['ServiceResponse']['AccountList']
    payer_account_id = payer_account_details["account"]["accountID"]
    payer_account_id = payer_account_id.lstrip("0")

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
    if payment_response.json()['code'] > 300:
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


    elif loan_request_data['status'] == "active":
        loan_request_data['amount_left'] -= payment_amount

        if loan_request_data['amount_left'] <= 0:
            loan_request_data['status'] = "closed"
        update_loan_request = requests.put(loan_request_URL + loan_request_id, json=loan_request_data)


    # 7. Send notification to payer


    # 8. Log transaction




    

        
    



    










if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for making a booking...")
    app.run(host="0.0.0.0", port=5300, debug=True)