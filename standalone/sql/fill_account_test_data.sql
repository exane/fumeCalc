-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 20. Mrz 2015 um 09:47
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
-- Tabellenstruktur für Tabelle `fumecalc`
--

DROP TABLE IF EXISTS `fumecalc`;
CREATE TABLE IF NOT EXISTS `fumecalc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fume` int(11) NOT NULL,
  `tim` int(11) NOT NULL,
  `viktor` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Daten für Tabelle `fumecalc`
--

INSERT INTO `fumecalc` (`fume`, `tim`, `viktor`) VALUES
(80000, 6000, 10000);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
