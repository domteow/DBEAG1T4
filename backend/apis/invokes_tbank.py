import json
from flask import jsonify
from functions import url
from functions import getRecord
import requests
from getProductTypes import getProductTypes
from getCustomerTypes import getCustomerTypes
import urllib.parse

##################################################################
###### SEND EMAIL FUNCTION (dom)
##################################################################
def invoke_sendEmail(data):
    headerObj = data['Header']
    contentObj = data['Content']
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    return response
    

##################################################################
###### SEND SMS FUNCTION (dom)
##################################################################
def invoke_sendSMS(data):
    headerObj = data['Header']
    contentObj = data['Content']  
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    return response

##################################################################
###### PAYMENT FUNCTION (dom)
##################################################################
def invoke_creditTransfer(data):
    headerObj = data['Header']
    contentObj = data['Content']  
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    return response

##################################################################
###### ADD BENEFICIARY FUNCTION (dom)
##################################################################
def invoke_addBeneficiary(data):
    headerObj = data['Header']
    contentObj = data['Content']  
    final_url="{0}?Header={1}&Content={2}".format(url(),json.dumps(headerObj),json.dumps(contentObj))
    response = requests.post(final_url)
    return response



##################################################################
###### CUSTOMER LOGIN FUNCTION
##################################################################
def invoke_login_customer(headerObj):
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)
    return response
    
        
##################################################################
###### GET CUSTOMER DETAILS
##################################################################
def invoke_get_customer_details(headerObj):
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)
    return response
    
           

    
##################################################################
###### GET CUSTOMER EXISTING ACCOUNTS
##################################################################
def invoke_get_customer_accounts(headerObj):
    
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    
    response = requests.post(final_url)
    return response
   

