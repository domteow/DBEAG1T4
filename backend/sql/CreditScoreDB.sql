DROP DATABASE IF EXISTS `CreditScoreDB`;
CREATE DATABASE IF NOT EXISTS `CreditScoreDB`;
USE `CreditScoreDB`;


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

INSERT INTO CreditScore (credit_score, user_id)
VALUES (750, 1), (600, 2), (800, 3);