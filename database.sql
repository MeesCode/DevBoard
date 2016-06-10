-- running this will empty your old database

DROP SCHEMA IF EXISTS `DevBoard` ;
CREATE SCHEMA IF NOT EXISTS `DevBoard` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `DevBoard` ;

-- Create table for posts
DROP TABLE IF EXISTS `DevBoard`.`post` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`post` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` TEXT NULL,
  `Subject` TEXT NULL,
  `Comment` TEXT NULL,
  `CreationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Thread` INT(11) NOT NULL,
  `Image` TEXT NULL,
  `IsThread` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`Id`)
);

-- Create table for threads
DROP TABLE IF EXISTS `DevBoard`.`thread` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`thread` (
  `Id` INT(11) NOT NULL,
  `Name` TEXT NULL,
  `Subject` TEXT NULL,
  `Comment` TEXT NULL,
  `CreationDate` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `UpdatedTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Board` TEXT NOT NULL,
  `Image` TEXT NOT NULL,
  PRIMARY KEY (`Id`)
);

-- List of boards
DROP TABLE IF EXISTS `DevBoard`.`board` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`board` (
  `Id` VARCHAR(5) NOT NULL,
  `Title` TEXT NOT NULL,
  PRIMARY KEY (`Id`)
);

-- Announcements
DROP TABLE IF EXISTS `Devboard`.`announcements` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`announcements` (
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `CreationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Comment` text NOT NULL,
  PRIMARY KEY (`Id`)
);

INSERT INTO board (Id, Title) VALUES ("g", "Technology");
INSERT INTO board (Id, Title) VALUES ("b", "Random");
INSERT INTO board (Id, Title) VALUES ("meta", "Site Discussion");
