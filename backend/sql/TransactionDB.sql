DROP DATABASE IF EXISTS TransactionDB;
CREATE DATABASE TransactionDB;
USE TransactionDB;

DROP TABLE IF EXISTS Transaction;

CREATE TABLE Transaction (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT;
    borrower_id int NOT NULL;
    lender_id int NOT NULL;
    amount decimal NOT NULL;
    reason varchar(255);
)