import json
from flask import jsonify
from functions import url
from functions import getRecord
import requests
from getProductTypes import getProductTypes
from getCustomerTypes import getCustomerTypes
import urllib.parse

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
    

# invoke_sendEmail('domteow', '999999', testemail)

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
    serviceName = 'creditTransfer'

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
    print(final_url)
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

# test from dom to bruno account
# invoke_creditTransfer('domteow','999999', '10008', '9998', '90')

##################################################################
###### CUSTOMER LOGIN FUNCTION
##################################################################
def invoke_login_customer(headerObj):
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)
    return response
    
        
# invoke_login_customer("brunogjh","815405")


##################################################################
###### GET CUSTOMER DETAILS
##################################################################
def invoke_get_customer_details(headerObj):
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)
    return response
    
           

# invoke_get_customer_details("brunogjh","815405")
    
##################################################################
###### GET CUSTOMER EXISTING ACCOUNTS
##################################################################
def invoke_get_customer_accounts(headerObj):
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    
    response = requests.post(final_url)
    return response

# invoke_get_customer_accounts("brunogjh","815405")
# invoke_get_customer_accounts("woofwoof","533551")    

##################################################################
###### ONBOARD CUSTOMER, mb dont need if we are not including customer creation
##################################################################
def invoke_onboard_customer():
    OTP ='',
    PIN ='',
    serviceName ='onboardCustomer',
    userID =''

    IC_number = 'S1235414A'
    familyName = "zxc"
    givenName = "woofwoof"
    dateOfBirth = "1960-12-11"
    gender = "Male"
    occupation = "doggy"
    streetAddress ="SPCA CHOA CHU KANG"
    city = "Singapore"
    state = "Singapore"
    country = "Singapore"
    postalCode = "730808"
    emailAddress = "woofwoof@gmail.com"
    countryCode = "+65"
    mobileNumber = "91234123"
    preferredUserID = "woofwoof"
    currency = "SGD"
    bankID = "1"

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
                        'IC_number': IC_number,
                        'familyName': familyName,
                        'givenName': givenName,
                        'dateOfBirth': dateOfBirth,
                        'gender': gender,
                        'occupation': occupation,
                        'streetAddress': streetAddress,
                        'city': city,
                        'state': state,
                        'country': country,
                        'postalCode': postalCode,
                        'emailAddress': emailAddress,
                        'countryCode': countryCode,
                        'mobileNumber': mobileNumber,
                        'preferredUserID': preferredUserID,
                        'currency': currency,
                        'bankID': bankID
                        }
                        }

    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),urllib.parse.quote(json.dumps(contentObj)))
    response = requests.post(final_url)

    serviceRespHeader = response.json()['Content']['ServiceResponse']['ServiceRespHeader']
    errorCode = serviceRespHeader['GlobalErrorID']

    if errorCode == '010000':
        CustomerDetailsObj = response.json()['Content']['ServiceResponse']['CustomerDetails']
        print('AccountID: {}'.format(CustomerDetailsObj['AccountID']))
        print('CustomerID: {}'.format(CustomerDetailsObj['CustomerID']))
        print('PIN: {}'.format(CustomerDetailsObj['PIN']))

    elif errorCode == '010041':
        print("OTP has expired.\nYou will receiving a SMS")

    else:
        print(serviceRespHeader['ErrorText'])

# invoke_onboard_customer()