-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 16. Mrz 2015 um 13:07
-- Server Version: 5.6.17
-- PHP-Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `fume`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fumecalc_history`
--

DROP TABLE IF EXISTS `fumecalc_history`;
CREATE TABLE IF NOT EXISTS `fumecalc_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` text NOT NULL,
  `account_before` int(255) NOT NULL,
  `deduction` int(255) NOT NULL,
  `fees` int NOT NULL, #gebühren
  `after` int(255) NOT NULL,
  `note` text NOT NULL,
  `client` text NOT NULL, #kunde
  `signed` text NOT NULL, #wer hats eingetragen
  `private` int(1) NOT NULL,
  `history_id` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
