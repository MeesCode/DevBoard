-- running this will empty your old database

DROP SCHEMA IF EXISTS `DevBoard` ;
CREATE SCHEMA IF NOT EXISTS `DevBoard` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `DevBoard` ;

-- Create table for posts
DROP TABLE IF EXISTS `DevBoard`.`post` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`post` (
  `Id` INT(11) NOT NULL,
  `Name` TEXT NULL,
  `Subject` TEXT NULL,
	`Comment` TEXT NULL,
  `CreationDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `HasImage` BOOLEAN NOT NULL,
  PRIMARY KEY (`Id`)
);

-- Create table for threads
DROP TABLE IF EXISTS `DevBoard`.`thread` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`thread` (
  `Id` INT(11) NOT NULL,
  `Name` TEXT NULL,
  `Subject` TEXT NULL,
	`Comment` TEXT NULL,
  `CreationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Board` TEXT NOT NULL,
  PRIMARY KEY (`Id`)
);

-- Links posts and thread toghether
DROP TABLE IF EXISTS `DevBoard`.`link` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`link` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `ThreadId` INT(11) NOT NULL,
  `PostId` INT(11) NOT NULL,
  PRIMARY KEY (`Id`)
)
