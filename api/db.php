<?php
/**
 * Database Connection Helper for GravityCore
 */

require_once __DIR__ . '/config.php';

/**
 * Get PDO connection to MySQL server without selecting a specific database.
 * Useful for setup and database creation.
 */
function getServerConnection(): PDO {
    $dsn = sprintf("mysql:host=%s;port=%d;charset=%s", DB_HOST, DB_PORT, DB_CHARSET);
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to connect to MySQL server: " . $e->getMessage()
        ]);
        exit();
    }
}

/**
 * Get PDO connection to the 'gravitycore' database.
 */
function getDatabaseConnection(): PDO {
    $dsn = sprintf("mysql:host=%s;port=%d;dbname=%s;charset=%s", DB_HOST, DB_PORT, DB_NAME, DB_CHARSET);
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Failed to connect to database '" . DB_NAME . "': " . $e->getMessage(),
            "hint" => "Run setup_db.php to automatically create the database and tables."
        ]);
        exit();
    }
}
