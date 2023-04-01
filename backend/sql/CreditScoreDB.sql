DROP DATABASE IF EXISTS CreditScoreDB;
CREATE DATABASE CreditScoreDB;
USE CreditScoreDB;


DROP TABLE IF EXISTS CreditScore;

CREATE TABLE IF NOT EXISTS CreditScore (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id varchar(255) NOT NULL,
    credit_score int NOT NULL
    
);

INSERT INTO CreditScore (user_id, credit_score)
VALUES ("domteow", 750), ("kelvinyap", 600), ("brunogoh", 800);