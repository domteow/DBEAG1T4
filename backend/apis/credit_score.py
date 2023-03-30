import platform
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)

if platform.system() == "Windows":
    db_url = 'mysql+mysqlconnector://root@localhost:3306/CreditScoreDB'
elif platform.system() == "Darwin": # for macOS
    db_url = 'mysql+mysqlconnector://root:root@localhost:3306/CreditScoreDB'

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or  db_url

db=SQLAlchemy(app)
CORS(app)

class CreditScore(db.Model):
    __tablename__ = 'creditscore'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    credit_score = db.Column(db.Integer, nullable = False)
    

    def __init__(self, user_id, credit_score):
        self.user_id = user_id
        self.credit_score = credit_score

    def json(self):
        return {"credit_score_id": self.id, "user_id": self.user_id, "credit_score": self.credit_score}

@app.route("/creditscore/getall")
def get_all():
    creditScoreList = CreditScore.query.all()
    if len(creditScoreList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "credit_scores": [creditScore.json() for creditScore in creditScoreList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No credit scores in database."
        }
    ), 404


@app.route("/creditscore/get/<string:creditscore_id>")
def find_by_credit_score_id(creditscore_id):
    creditScore = CreditScore.query.filter_by(id=creditscore_id).first()
    if creditScore:
        return jsonify(
            {
                "code": 200,
                "data": creditScore.json()
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "Credit score not found."
        }
    ), 404


@app.route("/creditscore/user/getall/<string:userid>")
def user_get_all(userid):
    creditScoreList = CreditScore.query.filter_by(user_id=userid).all()
    if len(creditScoreList):
        return jsonify(
            {
                "code": 200,
                "data": {
                    "credit_scores": [creditScore.json() for creditScore in creditScoreList]
                }
            }
        )
    return jsonify(
        {
            "code": 404,
            "message": "No credit scores found."
        }
    ), 404


@app.route("/creditscore/create", methods=['POST'])
def create_credit_score():
    data = request.get_json()
    creditScore = CreditScore(**data)

    try:
        db.session.add(creditScore)
        db.session.commit()
    except:
        return jsonify(
            {
                "code": 500,
                "data": {
                    "transaction_id": creditScore.credit_score_id
                },
                "message": "An error occurred creating the credit score."
            }
        ), 500

    return jsonify(
        {
            "code": 201,
            "data": creditScore.json()
        }
    ), 201




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
