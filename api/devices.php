<?php
/**
 * Devices API Endpoint for GravityCore
 */

require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM devices WHERE id = ? OR device_code = ?");
            $stmt->execute([$_GET['id'], $_GET['id']]);
            $device = $stmt->fetch();

            if ($device) {
                echo json_encode(["status" => "success", "data" => $device]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Device not found"]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM devices ORDER BY id ASC");
            $devices = $stmt->fetchAll();
            echo json_encode(["status" => "success", "count" => count($devices), "data" => $devices]);
        }
        break;

    case 'POST':
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true) ?? $_POST;

        if (empty($input['device_code']) && empty($input['deviceId'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required device code/ID"]);
            exit();
        }

        $deviceCode = $input['device_code'] ?? $input['deviceId'];
        $deviceName = $input['device_name'] ?? ($input['name'] ?? 'Gravity IoT Sensor Node');
        $model = $input['model'] ?? 'Gravity Sensor Unit v3';
        $location = $input['location'] ?? 'Main Facility';
        $status = $input['status'] ?? 'online';

        try {
            $stmt = $pdo->prepare("INSERT INTO devices (device_code, device_name, model, location, status, last_seen) 
                                   VALUES (?, ?, ?, ?, ?, NOW()) 
                                   ON DUPLICATE KEY UPDATE device_name=VALUES(device_name), model=VALUES(model), location=VALUES(location), status=VALUES(status), last_seen=NOW()");
            $stmt->execute([$deviceCode, $deviceName, $model, $location, $status]);

            $newId = $pdo->lastInsertId();
            http_response_code(201);
            echo json_encode([
                "status" => "success",
                "message" => "Device updated/registered successfully",
                "device_id" => (int)$newId
            ]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Failed to save device: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);

        if (empty($input['id']) && empty($input['device_code'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing device identifier for update"]);
            exit();
        }

        $identifier = $input['id'] ?? $input['device_code'];
        $deviceName = $input['device_name'] ?? $input['name'];
        $status = $input['status'] ?? 'online';

        try {
            $stmt = $pdo->prepare("UPDATE devices SET device_name = COALESCE(?, device_name), status = COALESCE(?, status), last_seen = NOW() WHERE id = ? OR device_code = ?");
            $stmt->execute([$deviceName, $status, $identifier, $identifier]);

            echo json_encode(["status" => "success", "message" => "Device updated successfully"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Failed to update device: " . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true) ?? $_GET;

        if (empty($input['id']) && empty($input['device_code'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing device identifier for deletion"]);
            exit();
        }

        $identifier = $input['id'] ?? $input['device_code'];

        try {
            $stmt = $pdo->prepare("DELETE FROM devices WHERE id = ? OR device_code = ?");
            $stmt->execute([$identifier, $identifier]);

            echo json_encode(["status" => "success", "message" => "Device deleted successfully"]);
        } catch (PDOException $e) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Failed to delete device: " . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
