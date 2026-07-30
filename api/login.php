<?php
/**
 * Super Admin Login Endpoint for GravityCore
 */

require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed. Use POST."]);
    exit();
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?? $_POST;

$emailOrUsername = trim($input['email'] ?? $input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($emailOrUsername) || empty($password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please enter email/username and password."]);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE (email = ? OR username = ?) AND role = 'admin' LIMIT 1");
    $stmt->execute([$emailOrUsername, $emailOrUsername]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Try updating last_login timestamp safely
        try {
            $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);
        } catch (Exception $ignored) {
            // Non-critical update failure ignored
        }

        echo json_encode([
            "status" => "success",
            "message" => "Authenticated successfully",
            "user" => [
                "id" => (int)$user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role'],
                "last_login" => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "status" => "error",
            "message" => "Invalid administrator email or password. Please verify your credentials."
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database authentication error: " . $e->getMessage()]);
}
