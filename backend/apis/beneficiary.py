from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)
CORS(app)


@app.route("/beneficiary/add", methods=['POST'])
def add_beneficiary():
    data = request.get_json()
    response = invokes_tbank.invoke_addBeneficiary(data)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        return jsonify(
            {
                "code": 200,
                "data": response.json(),
                'message': 'Beneficiary added successfully'
            } 
       )
    else:
        return jsonify(
            {
                "code": 500,
                "data": {},
                'message': serviceRespHeader['ErrorText']
            } 
       )
    

if(__name__ == '__main__'):
    app.run(host='0.0.0.0', port=5007, debug=True)