from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)
CORS(app)


@app.route("/notification/sendemail", methods=['POST'])
def sendEmail():
    data = request.get_json()
    response = invokes_tbank.invoke_sendEmail(data)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        return jsonify(
            {
                "code": 200,
                "data": response.json(),
                'message': 'Email sent'
            } 
       )

    elif errorCode == '010041':
        return jsonify(
            {
                "code": 400,
                "data": {},
                'message': 'OTP has expired.\nYou will be receiving a SMS'
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
    
@app.route("/notification/sendSMS", methods=['POST'])
def sendSMS():
    data = request.get_json()
    response = invokes_tbank.invoke_sendSMS(data)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        return jsonify(
            {
                "code": 200,
                "data": response.json(),
                'message': 'SMS sent'
            } 
       )

    elif errorCode == '010041':
        return jsonify(
            {
                "code": 400,
                "data": {},
                'message': 'OTP has expired.\nYou will be receiving a SMS'
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)