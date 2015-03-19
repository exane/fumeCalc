
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
  `fume` int(11) NOT NULL,
  `tim` int(11) NOT NULL,
  `viktor` int(11) NOT NULL,
  `history` int(10) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `fumecalc` (`fume`, `tim`, `viktor`, `history`) VALUES
  (0, 0, 0, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=26 ;