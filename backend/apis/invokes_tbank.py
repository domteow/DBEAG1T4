import json
from flask import jsonify
from functions import url
import requests


#dom
def invoke_sendEmail(userID, PIN, email_content, OTP='999999'):
    serviceName = 'sendEmail'
    headerObj = {
                        'Header': {
                        'serviceName': serviceName,
                        'userID': userID,
                        'PIN': PIN,
                        'OTP': OTP
                        }
                        }
    contentObj = {
                        'Content': email_content
                        }
    
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    print(response.json())
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    
    if errorCode == '010000':
        print("Email sent")
        return jsonify({"code":200}),200
    elif errorCode == '010041':
        print("OTP has expired.")
        return jsonify({"code":404}),404
    else:
        print(serviceRespHeader['ErrorText'])
        return jsonify({"code":404}),404
    
testemail = {
    "emailAddress": "dominicteow@gmail.com",
    "emailSubject": "Test Email",
    "emailBody": "This is a test email"
}
    

invoke_sendEmail('domteow', '999999', testemail)

# idk why this doesnt work LOL - dom
def invoke_sendSMS():
    serviceName = 'setQuestionScore' # this is correct, this api is meant for game score
    userID = 'domteow'
    emailAddress = 'dominicteow@gmail.com'
    PIN = '999999'
    OTP = '999999'
    mobileNumber = '+6594231328'
    message = 'Test SMS'


    headerObj = {
                        'Header': {
                        'serviceName': serviceName,
                        'userID': userID,
                        'PIN': PIN,
                        'OTP': OTP,
                        'mobileNumber': mobileNumber
                        }
                        }
    contentObj = {
                        'Content': {
                        
                            'message': message
                        }
                        }
    
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']
    
    if errorCode == '010000':
        print("SMS sent")
        return jsonify({"code":200}),200
    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")
        return jsonify({"code":404}),404
    else:
        print(serviceRespHeader['ErrorText'])
        return jsonify({"code":404}),404

#dom
def invoke_creditTransfer(userID, PIN, accountFrom, accountTo, transactionAmount, transactionReferenceNumber='', narrative='', OTP = '999999'):
    serviceName = 'directDebit'

    headerObj = {
                    'Header': {
                    'serviceName': serviceName,
                    'userID': userID,
                    'PIN': PIN,
                    'OTP': OTP
                    }
                }
    
    contentObj = {
                        'Content': {
                        'accountFrom': accountFrom,
                        'accountTo': accountTo,
                        'transactionAmount':transactionAmount,
                        'transactionReferenceNumber':transactionReferenceNumber,
                        'narrative':narrative
                        }
                        }
    
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        
        ServerResponse = response.json()['Content']['ServiceResponse']
        #return transaction ID, balance before and after
        return jsonify({
            "transactionID":ServerResponse['TransactionID']['_content_'],
            "balanceBefore":ServerResponse['BalanceBefore']['_content_'],
            "balanceAfter":ServerResponse['BalanceAfter']['_content_']
            })
    elif errorCode == '010041':
        return jsonify({"error":"OTP has expired."}),401
    else:
        return jsonify({"error":serviceRespHeader['ErrorText']}),500

    
    
