DROP DATABASE IF EXISTS `LoanOfferDB`;
CREATE DATABASE IF NOT EXISTS `LoanOfferDB`;
USE `LoanOfferDB`;

DROP TABLE IF EXISTS LoanOffer;

CREATE TABLE IF NOT EXISTS LoanOffer (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    loan_request_id int NOT NULL,
    borrower_id varchar(255) NOT NULL,
    lender_id varchar(255) NOT NULL
    );

INSERT INTO LoanOffer (loan_request_id, borrower_id, lender_id)
VALUES (1, "domteow", "brunogoh"), (2, "brunogoh", "domteow");