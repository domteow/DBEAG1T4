from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_cors import CORS
import invokes_tbank

app = Flask(__name__)
CORS(app)
# app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('dbURL') or 'mysql+mysqlconnector://root:root@localhost:3306/order'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 299}

# db = SQLAlchemy(app)



@app.route("/customer/login", methods=['POST'])
def customer_login():
    login_data = request.get_json()
    login_response = invokes_tbank.invoke_login_customer(login_data)

    serviceRespHeader = login_response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
       

       LoginOTPAuthenticateResponseObj = login_response.json()['Content']['ServiceResponse']['Login_OTP_Authenticate-Response']
       return jsonify(
            {
                "code": 200,
                "data": login_response.json(),
                'message': 'Login Successful'
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


@app.route("/customer/getaccounts", methods=['POST'])
def customer_get_accounts():
    data = request.get_json()
    response = invokes_tbank.invoke_get_customer_accounts(data)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
       acc_list = response.json()['Content']['ServiceResponse']['AccountList']
       if acc_list == {}:
            return jsonify(
            {
                "code": 200,
                "data": {},
                "message": "No record found!"
                
            } 
       )
       else:
           reply_data = acc_list['account']
           return jsonify(
                    {
                        "code": 200,
                        "data": reply_data.json(),
                        
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

@app.route("/customer/getdetails", methods=['POST'])
def customer_get_details():
    data = request.get_json()
    response = invokes_tbank.invoke_get_customer_details(data)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
    
       return jsonify(
            {
                "code": 200,
                "data": response.json()
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
    app.run(host='0.0.0.0', port=5001, debug=True)
    # app.run(host='0.0.0.0', port=5002, debug=True)


