from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
import json

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
    -> take in lender_id, loan_request_id, borrower_account_id
    -> get lender account num by lender_id
    -> update row in loan_request (add in lender_id, monthly_installment, amount_left, update "status)
    -> use payment to transfer money
    -> use transaction to keep record
    """
    # 1. Get lender_id, loan_request_id, borrower_account_id
    data = request.get_json()
    lender_id = data['Header']['userID']
    PIN = data['Header']['PIN']
    OTP = data['Header']['OTP']
    borrower_account_id = data['Content']['accountID']
    loan_request_id = data['Content']['loan_request_id']

    # # 2. Get borrower_id using loan request id
    # loan_request = requests.get(loan_request_URL + loan_request_id)
    # borrower_id = loan_request.json()['data']['borrower_id']

    # 3. Get lender account id using lender id
    lender_headerObj = {
        "Header" : {
            "serviceName" : "getCustomerAccounts",
            "userID" : lender_id,
            "PIN" : PIN,
            "OTP" : OTP
        }
    }

    lender_response = requests.post(customer_URL, json=lender_headerObj)
    if lender_response.json()['code'] != 200:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Payment Failed, failed to get lender account details'
            } 
        )
    lender_account_details = lender_response.json()['data']['Content']['ServiceResponse']['AccountList']
    lender_account_id


    



    # 1. Call payment service to make payment
    response = requests.post(payment_URL, json=data)
    print("Payment service response:", response.json())

    # 2. Call transaction service to create transaction record
    if response.status_code == 200:
        data = response.json()['data']
        data['paymentID'] = data['Content']['ServiceResponse']['ServiceRespBody']['PaymentID']
        data['paymentStatus'] = data['Content']['ServiceResponse']['ServiceRespBody']['PaymentStatus']
        # del data['Content']
        print("Data to be sent to transaction service:", data)

        response = requests.post(transaction_URL, json=data)
        print("Transaction service response:", response.json())

        if response.status_code == 200:
            return jsonify(
                {
                    "code": 200,
                    "data": response.json(),
                    'message': 'Payment Successful'
                } 
            )
        else:
            return jsonify(
                {
                    "code": 500,
                    "data": {},
                    'message': 'Payment Failed'
                } 
            )
    else:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Payment Failed'
            } 
        )










if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for making a booking...")
    app.run(host="0.0.0.0", port=5300, debug=True)