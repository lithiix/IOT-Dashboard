-- ========================================================
-- GravityCore Database Schema
-- Compatible with MySQL / MariaDB & phpMyAdmin
-- Database: gravitycore
-- Host: localhost | User: root | Password: (empty)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `gravitycore` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gravitycore`;

-- --------------------------------------------------------
-- Table structure for `devices`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `devices` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_code` VARCHAR(50) NOT NULL UNIQUE,
    `device_name` VARCHAR(100) NOT NULL,
    `status` ENUM('online', 'offline', 'maintenance') DEFAULT 'online',
    `last_seen` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `device_logs`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `device_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` INT NOT NULL,
    `temperature` DECIMAL(5,2) NULL,
    `humidity` DECIMAL(5,2) NULL,
    `gas` DECIMAL(6,2) NULL,
    `recorded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `system_metrics`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `system_metrics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `metric_key` VARCHAR(50) NOT NULL UNIQUE,
    `metric_value` VARCHAR(255) NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `alerts`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `alerts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `device_id` INT NULL,
    `alert_type` VARCHAR(50) NOT NULL,
    `message` TEXT NOT NULL,
    `severity` ENUM('info', 'warning', 'critical') DEFAULT 'info',
    `is_resolved` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Sample Data Insertion
-- --------------------------------------------------------

INSERT IGNORE INTO `devices` (`id`, `device_code`, `device_name`, `status`, `last_seen`) VALUES
(1, 'DEV-001', 'Temperature Sensor Alpha', 'online', NOW()),
(2, 'DEV-002', 'Humidity Monitor Beta', 'online', NOW()),
(3, 'DEV-003', 'Gas & Air Quality Sensor Gamma', 'online', NOW());

INSERT IGNORE INTO `device_logs` (`id`, `device_id`, `temperature`, `humidity`, `gas`, `recorded_at`) VALUES
(1, 1, 35.50, 65.20, 270.00, NOW()),
(2, 1, 36.10, 64.80, 275.50, NOW()),
(3, 2, 28.30, 89.10, 180.00, NOW()),
(4, 3, 30.00, 72.00, 310.40, NOW());

INSERT IGNORE INTO `system_metrics` (`id`, `metric_key`, `metric_value`) VALUES
(1, 'total_devices', '3'),
(2, 'active_alerts', '0'),
(3, 'system_status', 'healthy');
