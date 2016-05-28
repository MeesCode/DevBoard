-- running this will empty your old database

DROP SCHEMA IF EXISTS `DevBoard` ;
CREATE SCHEMA IF NOT EXISTS `DevBoard` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `DevBoard` ;

-- create table
DROP TABLE IF EXISTS `DevBoard`.`post` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`post` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` TEXT NULL,
  `Subject` TEXT NULL,
	`Comment` TEXT NOT NULL,
  `CreationDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `HasImage` BOOLEAN NOT NULL,
  PRIMARY KEY (`Id`)
)
