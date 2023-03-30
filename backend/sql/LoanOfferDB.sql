DROP DATABASE IF EXISTS `LoanOfferDB`;
CREATE DATABASE IF NOT EXISTS `LoanOfferDB`;
USE `LoanOfferDB`;

DROP TABLE IF EXISTS LoanOffer;

CREATE TABLE IF NOT EXISTS LoanOffer (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    loan_request_id int NOT NULL,
    borrower_id int NOT NULL,
    lender_id int NOT NULL,
    );

INSERT INTO LoanOffer (loan_request_id, borrower_id, lender_id)
VALUES (1, 1, 2), (2, 2, 1);