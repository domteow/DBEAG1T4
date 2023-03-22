import requests, json
from functions import url

def getProductTypes(ProductID):
    serviceName = 'getProductTypes'
    headerObj = {
                        'Header': {
                        'serviceName': serviceName,
                        'userID': '',
                        'PIN': '',
                        'OTP': ''
                        }
                        }
    final_url="{0}?Header={1}".format(url(),json.dumps(headerObj))
    response = requests.post(final_url)

    product = response.json()['Content']['ServiceResponse']['ProductList']['Product']
    ID_List= []
    Name_List = []
    
    for i in range(len(product)):
        ProductType = product[i]
        ID_List.append(ProductType['ProductID'])
        Name_List.append(ProductType['ProductName'])

    if ProductID in ID_List:
        index = ID_List.index(ProductID)
        return Name_List[index]
    else:
        return 'Record not found'
