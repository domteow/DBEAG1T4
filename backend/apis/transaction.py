import platform
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)

if platform.system() == "Windows":
    db_url = 'mysql+mysqlconnector://root@localhost:3306/transactiondb'
elif platform.system() == "Darwin": # for macOS
    db_url = 'mysql+mysqlconnector://root:root@localhost:3306/transactiondb'

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or  db_url

db=SQLAlchemy(app)
CORS(app)

class Transaction(db.Model):
    __tablename__ = 'transaction'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    borrower_id = db.Column(db.String(255), nullable = False)
    lender_id = db.Column(db.String(255), nullable = False)
    amount = db.Column(db.Float(precision=2), nullable=False)
    reason = db.Column(db.String(255), nullable=False)
    transaction_date = db.Column(db.DateTime, nullable=False)

    def __init__(self, borrower_id, lender_id, amount, reason, transaction_date):
        self.borrower_id = borrower_id
        self.lender_id = lender_id
        self.amount = amount
        self.reason = reason
        self.transaction_date = transaction_date

    def json(self):
        return {"transaction_id": self.id, "borrower_id": self.borrower_id, "lender_id": self.lender_id, "amount": self.amount, "reason": self.reason, "transaction_date": self.transaction_date}

@app.route("/transaction/getall")
def get_all():
    transactionList = Transaction.query.all()
    if len(transactionList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "transactions": [transaction.json() for transaction in transactionList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No transactions yet."
        }
    ), 404


@app.route("/transaction/get/<string:transaction_id>")
def find_by_transactionid(transaction_id):
    transaction = Transaction.query.filter_by(id=transaction_id).first()
    if transaction:
        return jsonify(
            {
                "code": 200,
                "data": transaction.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Transaction not found."
        }
    ), 404


@app.route("/transaction/borrower/getall/<string:userid>")
def borrower_get_all(userid):
    transactionList = Transaction.query.filter_by(borrower_id=userid).all()
    if len(transactionList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "transactions": [transaction.json() for transaction in transactionList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No transactions yet."
        }
    ), 404

@app.route("/transaction/lender/getall/<string:userid>")
def lender_get_all(userid):
    transactionList = Transaction.query.filter_by(lender_id=userid).all()
    if len(transactionList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "transactions": [transaction.json() for transaction in transactionList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No transactions yet."
        }
    ), 404


@app.route("/transaction/create", methods=['POST'])
def create_transaction():
    data = request.get_json()
    transaction = Transaction(**data)

    try:
        db.session.add(transaction)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "transaction_id": transaction.transaction_id
                },
                "message": "An error occurred creating the transaction."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": transaction.json()
        }
    ), 201




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)
