<?php
/**
 * Database Setup Script for GravityCore
 * Connects to MySQL using root credentials and initializes the 'gravitycore' database and tables.
 */

require_once __DIR__ . '/config.php';

$isCli = (php_sapi_name() === 'cli');

function logMessage(string $msg, bool $isCli) {
    if ($isCli) {
        echo $msg . PHP_EOL;
    }
}

$results = [
    "status" => "success",
    "database" => DB_NAME,
    "actions" => []
];

try {
    logMessage("Connecting to MySQL server at " . DB_HOST . "...", $isCli);
    
    // Connect to server without database selection
    $dsn = sprintf("mysql:host=%s;port=%d;charset=%s", DB_HOST, DB_PORT, DB_CHARSET);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 1. Create database
    $dbName = DB_NAME;
    $sqlCreateDb = "CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
    $pdo->exec($sqlCreateDb);
    $results["actions"][] = "Database '$dbName' created or already exists.";
    logMessage("Database '$dbName' ready.", $isCli);

    // 2. Select database
    $pdo->exec("USE `$dbName`");

    // 3. Create 'devices' table
    $sqlDevices = "CREATE TABLE IF NOT EXISTS `devices` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `device_code` VARCHAR(50) NOT NULL UNIQUE,
        `device_name` VARCHAR(100) NOT NULL,
        `model` VARCHAR(100) NULL DEFAULT 'Gravity IoT Sensor Node',
        `location` VARCHAR(100) NULL DEFAULT 'Main Facility',
        `status` ENUM('online', 'offline', 'maintenance', 'unassigned') DEFAULT 'online',
        `last_seen` DATETIME NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlDevices);
    $results["actions"][] = "Table 'devices' created or verified.";

    // 4. Create 'device_logs' table
    $sqlDeviceLogs = "CREATE TABLE IF NOT EXISTS `device_logs` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `device_id` INT NOT NULL,
        `ph` DECIMAL(4,2) NULL DEFAULT 7.20,
        `ec` DECIMAL(6,2) NULL DEFAULT 450.00,
        `oxygen` DECIMAL(4,2) NULL DEFAULT 8.20,
        `water_temp` DECIMAL(5,2) NULL DEFAULT 22.50,
        `env_temp` DECIMAL(5,2) NULL DEFAULT 26.80,
        `env_humidity` DECIMAL(5,2) NULL DEFAULT 62.00,
        `temperature` DECIMAL(5,2) NULL,
        `humidity` DECIMAL(5,2) NULL,
        `gas` DECIMAL(6,2) NULL,
        `recorded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlDeviceLogs);
    $results["actions"][] = "Table 'device_logs' created or verified.";

    // 5. Create 'system_metrics' table
    $sqlMetrics = "CREATE TABLE IF NOT EXISTS `system_metrics` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `metric_key` VARCHAR(50) NOT NULL UNIQUE,
        `metric_value` VARCHAR(255) NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlMetrics);
    $results["actions"][] = "Table 'system_metrics' created or verified.";

    // 6. Create 'alerts' table
    $sqlAlerts = "CREATE TABLE IF NOT EXISTS `alerts` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `device_id` INT NULL,
        `alert_type` VARCHAR(50) NOT NULL,
        `message` TEXT NOT NULL,
        `severity` ENUM('info', 'warning', 'critical') DEFAULT 'info',
        `is_resolved` TINYINT(1) DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlAlerts);
    $results["actions"][] = "Table 'alerts' created or verified.";

    // 7. Create 'users' table
    $sqlUsers = "CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `email` VARCHAR(100) NOT NULL UNIQUE,
        `password_hash` VARCHAR(255) NOT NULL,
        `role` ENUM('admin', 'user', 'viewer') DEFAULT 'admin',
        `last_login` DATETIME NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
    $pdo->exec($sqlUsers);
    $results["actions"][] = "Table 'users' created or verified.";

    // Ensure last_login column exists in users table
    $userColumns = $pdo->query("SHOW COLUMNS FROM `users`")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('last_login', $userColumns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `last_login` DATETIME NULL AFTER `role`;");
    }

    // 8. Seed Default Super Admin User if no admin exists
    $stmtUsersCount = $pdo->query("SELECT COUNT(*) FROM `users` WHERE `role` = 'admin'");
    if ($stmtUsersCount->fetchColumn() == 0) {
        $defaultEmail = 'admin@gravitycore.io';
        $defaultUsername = 'superadmin';
        $defaultPasswordHash = password_hash('admin123', PASSWORD_BCRYPT);

        $stmtInsertAdmin = $pdo->prepare("INSERT INTO `users` (`username`, `email`, `password_hash`, `role`) VALUES (?, ?, ?, 'admin')");
        $stmtInsertAdmin->execute([$defaultUsername, $defaultEmail, $defaultPasswordHash]);
        $results["actions"][] = "Super Admin user '$defaultEmail' created in database with default password 'admin123'.";
    }

    // 9. Seed sample device data if 'devices' table is empty
    $stmtCount = $pdo->query("SELECT COUNT(*) FROM `devices`");
    if ($stmtCount->fetchColumn() == 0) {
        $sqlSeedDevices = "INSERT INTO `devices` (`id`, `device_code`, `device_name`, `model`, `location`, `status`, `last_seen`) VALUES
            (1, 'DEV-1001-ALPHA', 'Main Hydroponics Controller Node 01', 'Gravity Sensor Unit v3', 'Greenhouse Bay 1', 'online', NOW()),
            (2, 'DEV-9012-B', 'Reservoir Telemetry Board B2', 'Gravity EC/pH Pro Node', 'Nutrient Tank 2', 'online', NOW()),
            (3, 'DEV-3341-S', 'Climate Monitor Unit S1', 'Gravity Temp/Humidity Array', 'Lab Room 4', 'online', NOW());";
        $pdo->exec($sqlSeedDevices);

        $sqlSeedLogs = "INSERT INTO `device_logs` (`device_id`, `ph`, `ec`, `oxygen`, `water_temp`, `env_temp`, `env_humidity`, `temperature`, `humidity`, `gas`, `recorded_at`) VALUES
            (1, 7.20, 450.00, 8.20, 22.40, 26.80, 62.00, 35.50, 65.20, 270.00, NOW() - INTERVAL 15 MINUTE),
            (1, 7.10, 460.00, 8.10, 22.50, 27.00, 61.00, 36.10, 64.80, 275.50, NOW() - INTERVAL 10 MINUTE),
            (1, 7.30, 445.00, 8.30, 22.30, 26.50, 63.00, 35.80, 65.00, 272.00, NOW() - INTERVAL 5 MINUTE),
            (1, 7.20, 455.00, 8.20, 22.60, 26.90, 62.00, 36.00, 64.90, 274.00, NOW());";
        $pdo->exec($sqlSeedLogs);

        $results["actions"][] = "Seed data inserted for devices and logs.";
    }

    $results["message"] = "GravityCore database setup completed successfully!";
    logMessage("Database setup completed successfully!", $isCli);

} catch (PDOException $e) {
    $results["status"] = "error";
    $results["message"] = "Database setup failed: " . $e->getMessage();
    http_response_code(500);
}

if (!$isCli) {
    echo json_encode($results, JSON_PRETTY_PRINT);
}
