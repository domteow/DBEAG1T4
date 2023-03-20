import requests, json
from flask import Flask, request, jsonify, Blueprint
from apis.functions import url


email_api = Blueprint('email_api', __name__)
@email_api.route('/sendingEmail/success', methods=['POST'])
def sendEmailSuccess():
    serviceName = 'sendEmail'


    emailAddress = 'dominicteow@gmail.com'
    emailSubject = 'Test Email'
    emailBody = 'This is a test email'

    headerObj = {


    }