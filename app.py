import json
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from initdb import db

app = Flask(__name__)

import platform
my_os = platform.system()
if __name__ == "__main__":

    if my_os == "Windows":
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root' + '@localhost:3306/dbea_g1t4'
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root' + '@localhost:3306/dbea_g1t4'
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_size': 100,
        'pool_recycle': 280
        }
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite://"
    
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


CORS(app)

with app.app_context():
    db.init_app(app)
    db.create_all()


app.register_blueprint(email_api, url_prefix='/api/email_api')
