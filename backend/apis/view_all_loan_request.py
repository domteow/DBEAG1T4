from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys
from os import environ

import requests
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

credit_score_URL = environ.get('credit_score_URL') or "http://localhost:5005/creditscore"
loan_request_URL = environ.get('loan_request_URL') or "http://localhost:5006/loanrequest" 
loan_offer_URL = environ.get('loan_offer_URL') or "http://localhost:5007/loanoffer" 

@app.route("/view_all_loan_request", methods=['GET'])
def view_all_loan_request():
    """
    View all loan request
    -> get loan request
    -> get credit_score using borrower_id
    add together
    """
    # 1. get data from Loan Request DB
    loan_request_response = requests.get(loan_request_URL + "/getall")

    if 300 > loan_request_response.json()['code'] > 200:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': 'Failed to get loan request details'
            } 
        )
    
    loan_request_data = loan_request_response.json()['data']

    all_loan_requests = loan_request_data["loan_requests"]
    
    # 2. Loop through all loan requests

    for loan_request in all_loan_requests:
        borrower_id = loan_request["borrower_id"]
        
        # 3. get customer details using borrower id
        

        credit_score = requests.get(credit_score_URL + "/user/get/" + borrower_id).json()["data"]["credit_score"]

        if (credit_score >= 800):
            credit_score_grade = "Exceptional"
        elif (credit_score > 740):
            credit_score_grade = "Very Good"
        elif (credit_score > 670):
            credit_score_grade = "Good"
        elif (credit_score > 580):
            credit_score_grade = "Fair"
        elif (credit_score > 300):
            credit_score_grade = "Poor"
        else:
            credit_score_grade = "Bad"

    
        loan_request["credit_score"] = credit_score_grade
        
    return jsonify(
                {
                    "code": 200,
                    "data": {
                        "all_loan_requests": [loan_request for loan_request in all_loan_requests]
                        }
                } 
           )


if __name__ == "__main__":
    print("This is flask " + os.path.basename(__file__) + " for making a booking...")
    app.run(host="0.0.0.0", port=5400, debug=True)