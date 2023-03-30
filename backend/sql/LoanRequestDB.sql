DROP DATABASE IF EXISTS `LoanRequestDB`;
CREATE DATABASE IF NOT EXISTS `LoanRequestDB`;
USE `LoanRequestDB`;

DROP TABLE IF EXISTS LoanRequest;

CREATE TABLE IF NOT EXISTS LoanRequest (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    principal decimal NOT NULL,
    borrower_id int NOT NULL,
    lender_id int,
    interest_rate decimal NOT NULL,
    monthly_installment decimal,
    maturity_date varchar(20) NOT NULL,
    status varchar(20) NOT NULL,
    amount_left decimal
    );

INSERT INTO LoanRequest (principal, borrower_id, lender_id, interest_rate, monthly_installment, maturity_date, status, amount_left)
VALUES (10000, 1, NULL, 5.5, NULL, "2024-03-01", "request", NULL), (5000, 2, NULL, 6.2, NULL, "2023-06-01", "request", NULL);