import platform
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)

if platform.system() == "Windows":
    db_url = 'mysql+mysqlconnector://root@localhost:3306/LoanRequestDB'
elif platform.system() == "Darwin": # for macOS
    db_url = 'mysql+mysqlconnector://root:root@localhost:3306/LoanRequestDB'

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or  db_url

db=SQLAlchemy(app)
CORS(app)

class LoanRequest(db.Model):
    __tablename__ = 'LoanRequest'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    principal = db.Column(db.Float(precision=2), nullable=False)
    borrower_id = db.Column(db.String(255), nullable = False)
    lender_id = db.Column(db.String(255))
    interest_rate = db.Column(db.Float(precision=2), nullable=False)
    monthly_installment = db.Column(db.Float(precision=2))
    start_date = db.Column(db.String(20), nullable=False)
    maturity_date = db.Column(db.String(20), nullable=False)
    date_of_next_repayment = db.Column(db.String(20), nullable=False)
    loan_term = db.Column(db.String(20), nullable=False)
    repayment_period = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    amount_left = db.Column(db.Float(precision=2))
    reason  = db.Column(db.String(255), nullable = False)
    borrower_name = db.Column(db.String(255), nullable = False)
    borrower_nationality = db.Column(db.String(255), nullable = False)
    borrower_occupation = db.Column(db.String(255), nullable = False)
    borrower_type = db.Column(db.String(255), nullable = False)
    borrower_account_num = db.Column(db.String(255), nullable = False)
    lender_name = db.Column(db.String(255), nullable = False)
    lender_nationality = db.Column(db.String(255), nullable = False)
    lender_occupation = db.Column(db.String(255), nullable = False)
    lender_type = db.Column(db.String(255), nullable = False)
    lender_account_num = db.Column(db.String(255), nullable = False)

    def __init__(self, principal, borrower_id, lender_id, interest_rate, monthly_installment, start_date, maturity_date, date_of_next_repayment, loan_term, repayment_period, status, amount_left, reason, borrower_name, borrower_nationality, borrower_occupation, borrower_type, borrower_account_num, lender_name, lender_nationality, lender_occupation, lender_type, lender_account_num,):
        self.principal = principal
        self.borrower_id = borrower_id
        self.lender_id = lender_id
        self.interest_rate = interest_rate
        self.monthly_installment = monthly_installment
        self.start_date = start_date
        self.maturity_date = maturity_date
        self.date_of_next_repayment = date_of_next_repayment
        self.loan_term = loan_term
        self.repayment_period = repayment_period
        self.status = status
        self.amount_left = amount_left
        self.reason = reason
        self.borrower_name = borrower_name
        self.borrower_nationality = borrower_nationality
        self.borrower_occupation = borrower_occupation
        self.borrower_type = borrower_type
        self.borrower_account_num = borrower_account_num
        self.lender_name = lender_name
        self.lender_nationality = lender_nationality
        self.lender_occupation = lender_occupation
        self.lender_type = lender_type
        self.lender_account_num = lender_account_num
        

    def json(self):
        return {
            "loan_request_id": self.id,
            "principal": self.principal,
            "borrower_id": self.borrower_id,
            "lender_id": self.lender_id,
            "interest_rate": self.interest_rate,
            "monthly_installment": self.monthly_installment,
            "start_date": self.start_date,
            "maturity_date": self.maturity_date,
            "date_of_next_repayment": self.date_of_next_repayment,
            "loan_term": self.loan_term,
            "repayment_period": self.repayment_period,
            "status": self.status,
            "amount_left": self.amount_left,
            "reason": self.reason,
            "borrower_name": self.borrower_name,
            "borrower_nationality": self.borrower_nationality,
            "borrower_occupation": self.borrower_occupation,
            "borrower_type": self.borrower_type,
            "borrower_account_num": self.borrower_account_num,
            "lender_name": self.lender_name,
            "lender_nationality": self.lender_nationality,
            "lender_occupation": self.lender_occupation,
            "lender_type": self.lender_type,
            "lender_account_num": self.lender_account_num
            }

@app.route("/loanrequest/getall")
def get_all():
    LoanRequestList = LoanRequest.query.all()
    if len(LoanRequestList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "loan_requests": [loanRequest.json() for loanRequest in LoanRequestList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No loan requests in database."
        }
    ), 404


@app.route("/loanrequest/get/<string:loan_request_id>")
def find_by_loan_request_id(loan_request_id):
    loanRequest = LoanRequest.query.filter_by(id=loan_request_id).first()
    if loanRequest:
        return jsonify(
            {
                "code": 200,
                "data": loanRequest.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Loan Request not found."
        }
    ), 404


@app.route("/loanrequest/getallborrowerid/<string:borrower_id>")
def user_get_all_borrower_id(borrower_id):
    LoanRequestList = LoanRequest.query.filter_by(borrower_id=borrower_id).all()
    if len(LoanRequestList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "loan_requests": [loanRequest.json() for loanRequest in LoanRequestList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No loan requests found."
        }
    ), 404


@app.route("/loanrequest/create", methods=['POST'])
def create_loan_request():
    data = request.get_json()
    loanRequest = LoanRequest(**data)

    try:
        db.session.add(loanRequest)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {},
                "message": "An error occurred creating the loan request."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": loanRequest.json()
        }
    ), 201

@app.route("/loanrequest/update/<string:id>", methods=['PUT'])
def update_loan_request(id):
    data = request.get_json()
    loanRequest = LoanRequest.query.get(id)

    if loanRequest is None:
        return jsonify(
            {
                "code": 404,
                "message": "Loan request not found."
            }
        ), 404
    
    

    
    try:
        for key, value in data.items():
            if hasattr(loanRequest, key):
                setattr(loanRequest, key, value)

        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "loan_request_id": id
                },
                "message": "An error occurred updating the loan request."
            }
        ), 500

    return jsonify(
        {
            "code": 200,
            "data": loanRequest.json()
        }
    ), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)
