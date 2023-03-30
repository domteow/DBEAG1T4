DROP DATABASE IF EXISTS CreditScoreDB;
CREATE DATABASE CreditScoreDB;
USE CreditScoreDB;


DROP TABLE IF EXISTS CreditScore;

CREATE TABLE IF NOT EXISTS CreditScore (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL,
    credit_score int NOT NULL
    
);

INSERT INTO CreditScore (user_id, credit_score)
VALUES (1, 750), (2, 600), (3, 800);