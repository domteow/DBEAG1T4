SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS= 0;

--
-- Database: `dbea_g1t4`
--

DROP DATABASE IF EXISTS `dbea_g1t4`;
CREATE DATABASE IF NOT EXISTS `dbea_g1t4`;
USE `dbea_g1t4`;


-- --------------------------------------------------------

--
-- Table structure for table `CreditScore`
--

DROP TABLE IF EXISTS CreditScore;

CREATE TABLE IF NOT EXISTS CreditScore (
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    credit_score int NOT NULL,
    user_id int NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `LoanRequest`
--

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

INSERT INTO CreditScore (credit_score, user_id)
VALUES (750, 1), (600, 2), (800, 3);

INSERT INTO LoanRequest (principal, borrower_id, lender_id, interest_rate, monthly_installment, maturity_date)
VALUES (10000, 1, 2, 5.5, 200, '2024-03-01'), (5000, 2, 3, 6.2, 150, '2023-06-01');