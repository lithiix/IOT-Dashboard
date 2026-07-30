<?php
/**
 * GravityCore Database & API Configuration
 */

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Configuration
// define('DB_HOST', 'localhost');
// define('DB_USER', 'root');
// define('DB_PASS', '');
// define('DB_NAME', 'gravitycore');
// define('DB_PORT', 3306);
// define('DB_CHARSET', 'utf8mb4');

//Production db
# Database Configuration
DB_HOST= 'localhost'
DB_PORT= '3306'
DB_USER= 'kitcottc_DigitalAcademy'
DB_PASSWORD= 'gravitycore'
DB_NAME= 'kitcottc_DigitalAcademy'

# Server Configuration
PORT=8080