-- running this will empty your old database and create a new one

DROP SCHEMA IF EXISTS `DevBoard` ;
CREATE SCHEMA IF NOT EXISTS `DevBoard` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `DevBoard` ;



-- Create table for posts
DROP TABLE IF EXISTS `DevBoard`.`post`;

CREATE TABLE IF NOT EXISTS `DevBoard`.`post` (
  `Id` INT NOT NULL,
  `Name` TEXT NULL,
  `Comment` TEXT NULL,
  `CreationTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Thread` INT NOT NULL,
  `ImageId` INT NULL,
  PRIMARY KEY (`Id`)
);

-- Create table for threads
DROP TABLE IF EXISTS `DevBoard`.`thread` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`thread` (
  `Id` INT NOT NULL,
  `Name` TEXT NULL,
  `Subject` TEXT NULL,
  `Comment` TEXT NULL,
  `CreationTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `UpdatedTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Board` TEXT NOT NULL,
  `ImageId` INT NULL,
  `Pinned` BOOLEAN DEFAULT FALSE,
  `Closed` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`Id`)
);

-- Create table for images
DROP TABLE IF EXISTS `DevBoard`.`image` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`image` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `OriginalName` TEXT NULL,
  `Extention` TEXT NOT NULL,
  `Spoiler` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`Id`)
);

-- List of boards
DROP TABLE IF EXISTS `DevBoard`.`board` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`board` (
  `Id` VARCHAR(5) NOT NULL,
  `Title` TEXT NOT NULL,
  `Nsfw` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`Id`)
);

-- Announcements
DROP TABLE IF EXISTS `Devboard`.`announcements` ;

CREATE TABLE IF NOT EXISTS `DevBoard`.`announcements` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `CreationTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Comment` text NOT NULL,
  PRIMARY KEY (`Id`)
);

INSERT INTO board (Id, Title) VALUES ("g", "Technology");
INSERT INTO board (Id, Title) VALUES ("b", "Random");
INSERT INTO board (Id, Title) VALUES ("meta", "Site Discussion");
