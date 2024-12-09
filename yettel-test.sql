-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2024 at 04:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `yettel-test`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `body` text NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `body`, `userId`, `createdAt`, `updatedAt`) VALUES
(61, 'Complete homework for User 211', 2, '2024-12-09 00:34:11', '2024-12-09 01:10:23'),
(62, 'Buy groceries for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(63, 'Clean the house for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(64, 'Respond to emails for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(65, 'Finish coding project for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(66, 'Call the bank for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(67, 'Schedule doctor appointment for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(68, 'Walk the dog for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(69, 'Prepare for meeting for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(70, 'Organize files for User 2', 2, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(71, 'updated task again', 3, '2024-12-09 00:34:11', '2024-12-09 01:08:45'),
(72, 'Buy groceries for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(73, 'Clean the house for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(74, 'Respond to emails for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(75, 'Finish coding project for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(76, 'Call the bank for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(77, 'Schedule doctor appointment for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(78, 'Walk the dog for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(79, 'Prepare for meeting for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(80, 'Organize files for User 3', 3, '2024-12-09 00:34:11', '2024-12-09 00:34:11'),
(83, 'tassdas', 3, '2024-12-09 02:53:02', '2024-12-09 02:53:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('basic','admin') NOT NULL DEFAULT 'basic',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'Admin', 'User', 'admin', 'admin@example.com', '$2b$10$hashed_password', 'admin', '2024-12-08 21:22:45', '2024-12-08 21:22:45'),
(2, 'sa', 'promena', 'promena1', 'lazar@gmail.com', '$2b$10$BsPkXsfFfqNOp9g/PM.sk.As/7SdJGv7L0UAADJUZICFi9FRCssPm', 'basic', '2024-12-08 21:54:23', '2024-12-09 02:21:07'),
(3, 'lazar', 'kojic', 'lacke1', 'lacke@gmail.com', '$2b$10$EHzLpdYoAEwaeJBsRwH1i.fSk8zEa01qE4xi4b7ClFZ8OlrOgVeSW', 'basic', '2024-12-08 21:57:36', '2024-12-09 02:30:43'),
(4, 'lacko', 'luda', 'adminlaca', 'laca@gmail.com', '$2b$10$O.DaempsBJIZ8m6OUdJtH.cwMj7jKpO/0.bLuOlCSEiPLHqZ34Qru', 'admin', '2024-12-09 00:26:34', '2024-12-09 00:27:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
