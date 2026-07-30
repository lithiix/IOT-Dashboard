# GravityCore PHP Database & API

This directory contains the database setup, connection management, schema definitions, and REST API endpoints for the **GravityCore** IoT project.

## Database Credentials (phpMyAdmin / WAMP / XAMPP)

- **Host**: `localhost` / `127.0.0.1`
- **Username**: `root`
- **Password**: *(empty)*
- **Database Name**: `gravitycore`
- **Port**: `3306`

---

## Files Overview

| File | Description |
| :--- | :--- |
| [`config.php`](file:///d:/reactp/IOT-Dashboard/api/config.php) | Database configuration constants & CORS headers |
| [`db.php`](file:///d:/reactp/IOT-Dashboard/api/db.php) | PDO Database Connection helpers (`getDatabaseConnection`, `getServerConnection`) |
| [`setup_db.php`](file:///d:/reactp/IOT-Dashboard/api/setup_db.php) | Automated PHP setup script to create database `gravitycore` & tables |
| [`schema.sql`](file:///d:/reactp/IOT-Dashboard/api/schema.sql) | SQL file for phpMyAdmin import |
| [`index.php`](file:///d:/reactp/IOT-Dashboard/api/index.php) | Root API endpoint with status and summary metrics |
| [`devices.php`](file:///d:/reactp/IOT-Dashboard/api/devices.php) | Device management endpoint (`GET`, `POST`) |
| [`logs.php`](file:///d:/reactp/IOT-Dashboard/api/logs.php) | Sensor log telemetry endpoint (`GET`, `POST`) |

---

## How to Initialize the Database

### Option 1: Via PHP Script (Recommended)

Run the PHP setup script directly from your terminal or command prompt:

```bash
php api/setup_db.php
```

Or open `http://localhost/IOT-Dashboard/api/setup_db.php` in your web browser.

This will:
1. Connect to MySQL with `root` user and empty password.
2. Create database `gravitycore` if it does not exist.
3. Create tables (`devices`, `device_logs`, `system_metrics`, `alerts`, `users`).
4. Insert initial seed data for testing.

### Option 2: Via phpMyAdmin Interface

1. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
2. Click on the **Import** tab.
3. Choose the [`schema.sql`](file:///d:/reactp/IOT-Dashboard/api/schema.sql) file from the `api` folder.
4. Click **Go** to execute and build the `gravitycore` database.

---

## API Endpoints Summary

- **Status Overview**: `GET http://localhost/IOT-Dashboard/api/index.php`
- **List Devices**: `GET http://localhost/IOT-Dashboard/api/devices.php`
- **Add Device**: `POST http://localhost/IOT-Dashboard/api/devices.php` (Body JSON: `{"device_code":"DEV-004", "device_name":"Flow Sensor"}`)
- **Get Logs**: `GET http://localhost/IOT-Dashboard/api/logs.php?limit=10`
- **Post Log**: `POST http://localhost/IOT-Dashboard/api/logs.php` (Body JSON: `{"device_id": 1, "temperature": 36.5, "humidity": 62.0, "gas": 280.0}`)
