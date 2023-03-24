DROP DATABASE IF EXISTS CreditScoreDB;
CREATE DATABASE IF NOT EXISTS CreditScoreDB;
USE CreditScoreDB;


DROP TABLE IF EXISTS CreditScore;

CREATE TABLE IF NOT EXISTS CreditScore (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id int NOT NULL,
    credit_score int NOT NULL
    
);

INSERT INTO CreditScore (credit_score, user_id)
VALUES (1, 750), (2, 600), (3, 800), (1, 600), (3, 500), (4, 800);