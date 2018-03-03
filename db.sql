-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               10.2.8-MariaDB - mariadb.org binary distribution
-- Операционная система:         Win32
-- HeidiSQL Версия:              9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных maproll
CREATE DATABASE IF NOT EXISTS `maproll` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;
USE `maproll`;

-- Дамп структуры для таблица maproll.accesstokens
CREATE TABLE IF NOT EXISTS `accesstokens` (
  `user` int(11) DEFAULT NULL,
  `accessToken` tinytext CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Дамп данных таблицы maproll.accesstokens: ~2 rows (приблизительно)
/*!40000 ALTER TABLE `accesstokens` DISABLE KEYS */;
INSERT INTO `accesstokens` (`user`, `accessToken`) VALUES
	(0, '12R0VpERP1R7H4pt6D_UV_ANjwnFltDrYLNS2nExuy821x76LUyASoWj3lL1qKrz'),
	(1, '32lbbT_x6Mu285iv3cZ12k6ZFTD2OnRvsCHWYca7__wxtM9XN5X7SCuP2b_oTQcR');
/*!40000 ALTER TABLE `accesstokens` ENABLE KEYS */;

-- Дамп структуры для таблица maproll.bots
CREATE TABLE IF NOT EXISTS `bots` (
  `org` int(11) DEFAULT NULL,
  `username` tinytext COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Дамп данных таблицы maproll.bots: ~0 rows (приблизительно)
/*!40000 ALTER TABLE `bots` DISABLE KEYS */;
/*!40000 ALTER TABLE `bots` ENABLE KEYS */;

-- Дамп структуры для таблица maproll.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) DEFAULT NULL,
  `hash` tinytext COLLATE utf8mb4_bin DEFAULT NULL,
  `currier` int(11) DEFAULT NULL,
  `buyer` int(11) DEFAULT NULL,
  `seller` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `description` text CHARACTER SET utf8 DEFAULT NULL,
  `title` text CHARACTER SET utf8 DEFAULT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Дамп данных таблицы maproll.orders: ~3 rows (приблизительно)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` (`id`, `hash`, `currier`, `buyer`, `seller`, `price`, `description`, `title`, `status`) VALUES
	(0, '00fd268dbede63596669b25ef22fb2cd', NULL, NULL, 0, 100, 'Yeah! Very cool order, trully', 'Cool order', 0),
	(1, '4cd835480f0cc104d6c8f7ba8fc276f8', NULL, NULL, 0, 100, 'Yeah! Very cool order, trully', 'Cool order', 1),
	(2, '854af5927300116b642863cc0c69e404', NULL, NULL, 0, 100, 'Yeah! Very cool order, trully', 'Cool order', 1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Дамп структуры для таблица maproll.organisations
CREATE TABLE IF NOT EXISTS `organisations` (
  `id` int(11) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `title` text CHARACTER SET utf8 DEFAULT NULL,
  `description` text CHARACTER SET utf8 DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `botToken` tinytext CHARACTER SET utf8 DEFAULT NULL,
  `paymentToken` tinytext CHARACTER SET utf8 DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Дамп данных таблицы maproll.organisations: ~0 rows (приблизительно)
/*!40000 ALTER TABLE `organisations` DISABLE KEYS */;
INSERT INTO `organisations` (`id`, `owner`, `title`, `description`, `balance`, `botToken`, `paymentToken`) VALUES
	(0, 0, 'Aviaot', '', 0, '536532906:AAFNN0GDVDdPEGIAuH7s-vsu4EMb8mm575o', '');
/*!40000 ALTER TABLE `organisations` ENABLE KEYS */;

-- Дамп структуры для таблица maproll.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) DEFAULT NULL,
  `org` int(11) DEFAULT NULL,
  `login` tinytext CHARACTER SET utf8 DEFAULT NULL,
  `passhash` tinytext CHARACTER SET utf8 DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Дамп данных таблицы maproll.users: ~2 rows (приблизительно)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `org`, `login`, `passhash`, `status`, `latitude`, `longitude`) VALUES
	(0, 0, 'aviato@gmail.com', '5f4dcc3b5aa765d61d8327deb882cf99', 3, 13, 14),
	(1, 0, 'alex the currier', '5f4dcc3b5aa765d61d8327deb882cf99', 1, NULL, NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
