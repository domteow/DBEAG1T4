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
    borrower_id = db.Column(db.Integer, nullable = False)
    lender_id = db.Column(db.Integer)
    interest_rate = db.Column(db.Float(precision=2), nullable=False)
    monthly_installment = db.Column(db.Float(precision=2))
    maturity_date = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False)
    amount_left = db.Column(db.Float(precision=2))

    def __init__(self, principal, borrower_id, lender_id, interest_rate, monthly_installment, maturity_date, status, amount_left):
        self.principal = principal
        self.borrower_id = borrower_id
        self.lender_id = lender_id
        self.interest_rate = interest_rate
        self.monthly_installment = monthly_installment
        self.maturity_date = maturity_date
        self.status = status
        self.amount_left = amount_left
        

    def json(self):
        return {
            "loan_request_id": self.id,
            "principal": self.principal,
            "borrower_id": self.borrower_id,
            "lender_id": self.lender_id,
            "interest_rate": self.interest_rate,
            "monthly_installment": self.monthly_installment,
            "maturity_date": self.maturity_date,
            "status": self.status,
            "amount_left": self.amount_left
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
                "data": {
                    "loan_request_id": loanRequest.loan_request_id
                },
                "message": "An error occurred creating the credit score."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": loanRequest.json()
        }
    ), 201




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)
