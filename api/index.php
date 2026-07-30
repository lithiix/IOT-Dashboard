<?php
/**
 * GravityCore API - Main Entry Point
 */

require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();

try {
    $deviceStmt = $pdo->query("SELECT COUNT(*) as count FROM devices");
    $totalDevices = $deviceStmt->fetch()['count'];

    $logStmt = $pdo->query("SELECT COUNT(*) as count FROM device_logs");
    $totalLogs = $logStmt->fetch()['count'];

    echo json_encode([
        "name" => "GravityCore IoT API",
        "version" => "1.0.0",
        "status" => "online",
        "database" => DB_NAME,
        "metrics" => [
            "total_devices" => (int)$totalDevices,
            "total_logs" => (int)$totalLogs
        ],
        "endpoints" => [
            "GET  /api/index.php" => "API status and overview",
            "GET  /api/setup_db.php" => "Initialize database and tables",
            "GET  /api/devices.php" => "List all registered devices",
            "POST /api/devices.php" => "Create/Register a new device",
            "GET  /api/logs.php" => "Retrieve sensor reading logs",
            "POST /api/logs.php" => "Push new sensor log reading"
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "API error: " . $e->getMessage()
    ]);
}
