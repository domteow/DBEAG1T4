DROP DATABASE IF EXISTS `LoanRequestDB`;
CREATE DATABASE IF NOT EXISTS `LoanRequestDB`;
USE `LoanRequestDB`;

DROP TABLE IF EXISTS LoanRequest;

CREATE TABLE IF NOT EXISTS LoanRequest (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    principal decimal NOT NULL,
    borrower_id varchar(255) NOT NULL,
    lender_id varchar(255),
    interest_rate decimal NOT NULL,
    monthly_installment decimal,
    start_date varchar(20),
    maturity_date varchar(20),
    date_of_next_repayment varchar(20),
    loan_term varchar(20),
    repayment_period varchar(20),
    status varchar(20) NOT NULL,
    amount_left decimal,
    reason varchar(255) NOT NULL,
    borrower_name varchar(255) NOT NULL,
    borrower_nationality varchar(255) NOT NULL,
    borrower_occupation varchar(255) NOT NULL,
    borrower_type varchar(255) NOT NULL,
    borrower_account_num varchar(255) NOT NULL,
    borrower_PIN varchar(255) NOT NULL,
    lender_name varchar(255) NOT NULL,
    lender_nationality varchar(255) NOT NULL,
    lender_occupation varchar(255) NOT NULL,
    lender_type varchar(255) NOT NULL,
    lender_account_num varchar(255) NOT NULL
    );

INSERT INTO LoanRequest (principal, borrower_id, lender_id, interest_rate, monthly_installment, maturity_date, status, amount_left, reason,
borrower_name, borrower_nationality, borrower_occupation, borrower_type, borrower_account_num, borrower_PIN)
VALUES 

(10000, "domteow", NULL, 5.5, NULL, "2024-03-01", "request", NULL, "new PC",
 "Dom", "Singapore", "Student", "Retail","10008", "999999");

INSERT INTO LoanRequest (principal, borrower_id, lender_id, interest_rate, monthly_installment, maturity_date, status, amount_left, reason,
borrower_name, borrower_nationality, borrower_occupation, borrower_type, borrower_account_num, borrower_PIN,
lender_name, lender_nationality, lender_occupation, lender_type, lender_account_num)
VALUES
(5000, "domteow", "brunogoh", 6.2, 431, "2023-06-01", "active", 5000, "scamming bruno",
 "Dom", "Singapore", "Student", "Retail","10008", "999999", "Bruno", "Singapore", "Student", "Retail", "9998");