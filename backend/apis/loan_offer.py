import platform
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)

if platform.system() == "Windows":
    db_url = 'mysql+mysqlconnector://root@localhost:3306/LoanOfferDB'
elif platform.system() == "Darwin": # for macOS
    db_url = 'mysql+mysqlconnector://root:root@localhost:3306/LoanOfferDB'

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or  db_url

db=SQLAlchemy(app)
CORS(app)

class LoanOffer(db.Model):
    __tablename__ = 'LoanOffer'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    loan_request_id = db.Column(db.Integer, nullable = False)
    borrower_id = db.Column(db.String(255), nullable = False)
    lender_id = db.Column(db.String(255), nullable = False)


    def __init__(self, loan_request_id, borrower_id, lender_id):
        self.loan_request_id = loan_request_id
        self.borrower_id = borrower_id
        self.lender_id = lender_id

    def json(self):
        return {
            "loan_offer_id": self.id,
            "loan_request_id": self.loan_request_id,
            "borrower_id": self.borrower_id,
            "lender_id": self.lender_id
            }

@app.route("/loanoffer/getall")
def get_all():
    LoanOfferList = LoanOffer.query.all()
    if len(LoanOfferList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "loan_offers": [loanOffer.json() for loanOffer in LoanOfferList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No loan offers in database."
        }
    ), 404


@app.route("/loanoffer/get/<string:loan_offer_id>")
def find_by_loan_offer_id(loan_offer_id):
    loanOffer = LoanOffer.query.filter_by(id=loan_offer_id).first()
    if loanOffer:
        return jsonify(
            {
                "code": 200,
                "data": loanOffer.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Loan offer not found."
        }
    ), 404


@app.route("/loanoffer/getallborrowerid/<string:borrower_id>")
def user_get_all_borrower_id(borrower_id):
    LoanOfferList = LoanOffer.query.filter_by(borrower_id=borrower_id).all()
    if len(LoanOfferList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "loan_offerss": [loanOffer.json() for loanOffer in LoanOfferList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No loan offers found."
        }
    ), 404


@app.route("/loanrequest/create", methods=['POST'])
def create_loan_request():
    data = request.get_json()
    loanOffer = LoanOffer(**data)

    try:
        db.session.add(loanOffer)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "loan_offer_id": loanOffer.loan_offer_id
                },
                "message": "An error occurred creating the credit score."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": loanOffer.json()
        }
    ), 201




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007, debug=True)
