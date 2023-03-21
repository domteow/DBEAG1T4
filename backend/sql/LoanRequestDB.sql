DROP DATABASE IF EXISTS `LoanRequestDB`;
CREATE DATABASE IF NOT EXISTS `LoanRequestDB`;
USE `LoanRequestDB`;

DROP TABLE IF EXISTS LoanRequest;

CREATE TABLE IF NOT EXISTS LoanRequest (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    principal decimal NOT NULL,
    borrower_id int,
    lender_id int,
    interest_rate decimal NOT NULL,
    monthly_installment decimal NOT NULL,
    maturity_date varchar(20) NOT NULL
);

INSERT INTO LoanRequest (principal, borrower_id, lender_id, interest_rate, monthly_installment, maturity_date)
VALUES (10000, 1, 2, 5.5, 200, '2024-03-01'), (5000, 2, 3, 6.2, 150, '2023-06-01');