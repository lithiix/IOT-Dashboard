<?php
/**
 * Sensor Logs API Endpoint for GravityCore
 */

require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        $limit = isset($_GET['limit']) ? min((int)$_GET['limit'], 100) : 30;
        $deviceId = isset($_GET['device_id']) ? (int)$_GET['device_id'] : null;

        if ($deviceId) {
            $stmt = $pdo->prepare("SELECT l.*, d.device_name, d.device_code, d.model, d.location 
                                   FROM device_logs l 
                                   JOIN devices d ON l.device_id = d.id 
                                   WHERE l.device_id = ? 
                                   ORDER BY l.recorded_at ASC 
                                   LIMIT ?");
            $stmt->bindValue(1, $deviceId, PDO::PARAM_INT);
            $stmt->bindValue(2, $limit, PDO::PARAM_INT);
            $stmt->execute();
        } else {
            $stmt = $pdo->prepare("SELECT l.*, d.device_name, d.device_code, d.model, d.location 
                                   FROM device_logs l 
                                   JOIN devices d ON l.device_id = d.id 
                                   ORDER BY l.recorded_at ASC 
                                   LIMIT ?");
            $stmt->bindValue(1, $limit, PDO::PARAM_INT);
            $stmt->execute();
        }

        $logs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "count" => count($logs), "data" => $logs]);
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true) ?? $_POST;

        $deviceId = isset($input['device_id']) ? (int)$input['device_id'] : 1;
        
        $ph = isset($input['ph']) ? (float)$input['ph'] : 7.2;
        $ec = isset($input['ec']) ? (float)$input['ec'] : 450;
        $oxygen = isset($input['oxygen']) ? (float)$input['oxygen'] : 8.2;
        $waterTemp = isset($input['waterTemp']) ? (float)$input['waterTemp'] : (isset($input['water_temp']) ? (float)$input['water_temp'] : 22.5);
        $envTemp = isset($input['envTemp']) ? (float)$input['envTemp'] : (isset($input['env_temp']) ? (float)$input['env_temp'] : 26.8);
        $envHumidity = isset($input['envHumidity']) ? (float)$input['envHumidity'] : (isset($input['env_humidity']) ? (float)$input['env_humidity'] : 62);
        
        $temp = isset($input['temperature']) ? (float)$input['temperature'] : $envTemp;
        $humidity = isset($input['humidity']) ? (float)$input['humidity'] : $envHumidity;
        $gas = isset($input['gas']) ? (float)$input['gas'] : 270;

        try {
            $stmt = $pdo->prepare("INSERT INTO device_logs (device_id, ph, ec, oxygen, water_temp, env_temp, env_humidity, temperature, humidity, gas, recorded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$deviceId, $ph, $ec, $oxygen, $waterTemp, $envTemp, $envHumidity, $temp, $humidity, $gas]);

            // Update device last_seen timestamp
            $updateStmt = $pdo->prepare("UPDATE devices SET last_seen = NOW() WHERE id = ?");
            $updateStmt->execute([$deviceId]);

            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Sensor log recorded successfully",
                "log_id" => (int)$pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Failed to record log: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
