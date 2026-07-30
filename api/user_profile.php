<?php
/**
 * Super Admin Profile & Credential Management Endpoint for GravityCore
 */

require_once __DIR__ . '/db.php';

$pdo = getDatabaseConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // Return admin user details (excluding password hash)
    try {
        $stmt = $pdo->query("SELECT id, username, email, role, last_login, created_at, updated_at FROM users WHERE role = 'admin' LIMIT 1");
        $admin = $stmt->fetch();
        if ($admin) {
            echo json_encode(["status" => "success", "data" => $admin]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Admin user not found"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
    exit();
}

if ($method !== 'POST' && $method !== 'PUT') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true) ?? $_POST;

$currentEmail = trim($input['current_email'] ?? $input['email'] ?? '');
$newEmail = trim($input['new_email'] ?? $input['email'] ?? '');
$newUsername = trim($input['username'] ?? '');
$currentPassword = trim($input['current_password'] ?? '');
$newPassword = trim($input['new_password'] ?? '');

try {
    // Fetch current admin user
    $stmt = $pdo->query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    $admin = $stmt->fetch();

    if (!$admin) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Admin user not found"]);
        exit();
    }

    // Verify current password if changing password
    if (!empty($newPassword)) {
        if (empty($currentPassword) || !password_verify($currentPassword, $admin['password_hash'])) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Current password is incorrect. Credential update denied."]);
            exit();
        }
    }

    $updates = [];
    $params = [];

    if (!empty($newEmail) && $newEmail !== $admin['email']) {
        $updates[] = "`email` = ?";
        $params[] = $newEmail;
    }

    if (!empty($newUsername) && $newUsername !== $admin['username']) {
        $updates[] = "`username` = ?";
        $params[] = $newUsername;
    }

    if (!empty($newPassword)) {
        $updates[] = "`password_hash` = ?";
        $params[] = password_hash($newPassword, PASSWORD_BCRYPT);
    }

    if (empty($updates)) {
        echo json_encode(["status" => "info", "message" => "No changes submitted."]);
        exit();
    }

    $params[] = $admin['id'];
    $sql = "UPDATE users SET " . implode(", ", $updates) . ", updated_at = NOW() WHERE id = ?";
    $updateStmt = $pdo->prepare($sql);
    $updateStmt->execute($params);

    echo json_encode([
        "status" => "success",
        "message" => "Super Admin credentials updated successfully in database!",
        "updated_email" => !empty($newEmail) ? $newEmail : $admin['email'],
        "updated_username" => !empty($newUsername) ? $newUsername : $admin['username']
    ]);

} catch (PDOException $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Failed to update admin profile: " . $e->getMessage()]);
}
