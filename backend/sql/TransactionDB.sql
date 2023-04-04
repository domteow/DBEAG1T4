DROP DATABASE IF EXISTS TransactionDB;
CREATE DATABASE TransactionDB;
USE TransactionDB;

DROP TABLE IF EXISTS Transaction;

CREATE TABLE Transaction (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    payer_id varchar(255) NOT NULL,
    payee_id varchar(255) NOT NULL,
    amount decimal(5,2) NOT NULL,
    reason varchar(255),
    transaction_date varchar(20) NOT NULL
);

