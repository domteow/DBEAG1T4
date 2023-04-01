DROP DATABASE IF EXISTS TransactionDB;
CREATE DATABASE TransactionDB;
USE TransactionDB;

DROP TABLE IF EXISTS Transaction;

CREATE TABLE Transaction (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    borrower_id varchar(255) NOT NULL,
    lender_id varchar(255) NOT NULL,
    amount decimal NOT NULL,
    reason varchar(255),
    transaction_date varchar(20) NOT NULL
);

-- INSERT INTO Transaction (borrower_id, lender_id, amount, reason, transaction_date)
-- VALUES (1, 2, 100, 'Loan Repayment', '24-03-2023'), 
-- (2, 3, 150, 'Loan Repayment', '03-03-2023'), 
-- (2, 3, 300, 'Loan Repayment', '24-03-2023');