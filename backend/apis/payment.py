from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)
CORS(app)

@app.route("/payment/credittransfer", methods=['POST'])
def creditTransfer():
    data = request.get_json()
    response = invokes_tbank.invoke_creditTransfer(data)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        return jsonify(
            {
                "code": 200,
                "data": response.json(),
                'message': 'Credit Transfer Successful'
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
                'message': "tbankAPI response" + serviceRespHeader['ErrorText']
            } 
       )




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)