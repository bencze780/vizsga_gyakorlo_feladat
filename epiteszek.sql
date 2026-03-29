-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2026. Már 29. 11:58
-- Kiszolgáló verziója: 8.0.40
-- PHP verzió: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `epiteszet`
--
CREATE DATABASE IF NOT EXISTS `epiteszet` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `epiteszet`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `epitesz`
--

CREATE TABLE `epitesz` (
  `id` int NOT NULL,
  `nev` varchar(100) NOT NULL,
  `szulev` int DEFAULT NULL,
  `stilus` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `epitesz`
--

INSERT INTO `epitesz` (`id`, `nev`, `szulev`, `stilus`) VALUES
(1, 'Steindl Imre', 1839, 'Neogótikus'),
(2, 'Ybl Miklós', 1814, 'Neoreneszánsz'),
(3, 'Lechner Ödön', 1845, 'Szecesszió');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `epulet`
--

CREATE TABLE `epulet` (
  `id` int NOT NULL,
  `nev` varchar(100) NOT NULL,
  `varos` varchar(100) DEFAULT NULL,
  `epult` int DEFAULT NULL,
  `kep_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `epulet`
--

INSERT INTO `epulet` (`id`, `nev`, `varos`, `epult`, `kep_url`) VALUES
(1, 'Országház', 'Budapest', 1904, NULL),
(2, 'Operaház', 'Budapest', 1884, NULL),
(3, 'Iparművészeti Múzeum', 'Budapest', 1896, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kapcsolat`
--

CREATE TABLE `kapcsolat` (
  `epulet_id` int NOT NULL,
  `epitesz_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `kapcsolat`
--

INSERT INTO `kapcsolat` (`epulet_id`, `epitesz_id`) VALUES
(1, 1),
(2, 2),
(3, 3);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `epitesz`
--
ALTER TABLE `epitesz`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `epulet`
--
ALTER TABLE `epulet`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kapcsolat`
--
ALTER TABLE `kapcsolat`
  ADD PRIMARY KEY (`epulet_id`,`epitesz_id`),
  ADD KEY `epitesz_id` (`epitesz_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `epitesz`
--
ALTER TABLE `epitesz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `epulet`
--
ALTER TABLE `epulet`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `kapcsolat`
--
ALTER TABLE `kapcsolat`
  ADD CONSTRAINT `kapcsolat_ibfk_1` FOREIGN KEY (`epitesz_id`) REFERENCES `epitesz` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kapcsolat_ibfk_2` FOREIGN KEY (`epulet_id`) REFERENCES `epulet` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
