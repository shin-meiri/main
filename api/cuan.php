<?php
// /api/cuan.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Fungsi untuk koneksi database
function getConnection($host, $dbname, $username, $password) {
    try {
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 10
        ];
        
        return new PDO($dsn, $username, $password, $options);
    } catch (PDOException $e) {
        throw new Exception('Database Connection Error: ' . $e->getMessage());
    }
}

// Fungsi untuk validasi input
function validateInput($input, $requiredFields) {
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Field '$field' is required");
        }
    }
}

// Fungsi untuk validasi JSON
function validateJson($jsonString) {
    if (empty($jsonString) || $jsonString === '{}') {
        return true; // JSON kosong diizinkan
    }
    
    json_decode($jsonString);
    return (json_last_error() === JSON_ERROR_NONE);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Terima data dari request
        $input = json_decode(file_get_contents('php://input'), true);
        
        $host = $input['host'] ?? '';
        $dbname = $input['dbname'] ?? '';
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $action = $input['action'] ?? 'get'; // default action

        // Validasi input koneksi
        if (empty($host) || empty($dbname) || empty($username)) {
            throw new Exception('Host, database name, and username are required');
        }

        // Buat koneksi ke MySQL
        $pdo = getConnection($host, $dbname, $username, $password);

        // Test koneksi
        $stmt = $pdo->query("SELECT 1");
        $stmt->fetch();

        // Proses berdasarkan action
        switch ($action) {
            case 'get':
                // Query untuk mengambil data cuan
                $sql = "SELECT `id`, `masuk`, `kluar`, `time_stamp` FROM `cuan` ORDER BY `time_stamp` DESC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute();
                $data = $stmt->fetchAll();

                echo json_encode([
                    'success' => true,
                    'data' => $data,
                    'rowCount' => count($data),
                    'action' => 'get'
                ]);
                break;

            case 'insert':
                // Validasi input untuk insert
                if (empty($input['masuk']) && empty($input['kluar'])) {
                    throw new Exception('Minimal masukkan data masuk atau keluar');
                }
                
                $masuk = $input['masuk'] ?? '{}';
                $kluar = $input['kluar'] ?? '{}';
                $time_stamp = $input['time_stamp'] ?? date('Y-m-d H:i:s');

                // Validasi JSON
                if (!validateJson($masuk)) {
                    throw new Exception('Format JSON masuk tidak valid');
                }
                
                if (!validateJson($kluar)) {
                    throw new Exception('Format JSON kluar tidak valid');
                }

                $sql = "INSERT INTO `cuan` (`masuk`, `kluar`, `time_stamp`) VALUES (?, ?, ?)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$masuk, $kluar, $time_stamp]);

                echo json_encode([
                    'success' => true,
                    'message' => 'Data berhasil ditambahkan',
                    'action' => 'insert'
                ]);
                break;

            case 'update':
                // Validasi input untuk update
                if (empty($input['id'])) {
                    throw new Exception('ID is required');
                }
                
                $id = $input['id'];
                $masuk = $input['masuk'] ?? '{}';
                $kluar = $input['kluar'] ?? '{}';
                $time_stamp = $input['time_stamp'] ?? date('Y-m-d H:i:s');

                // Validasi JSON
                if (!validateJson($masuk)) {
                    throw new Exception('Format JSON masuk tidak valid');
                }
                
                if (!validateJson($kluar)) {
                    throw new Exception('Format JSON kluar tidak valid');
                }

                $sql = "UPDATE `cuan` SET `masuk` = ?, `kluar` = ?, `time_stamp` = ? WHERE `id` = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$masuk, $kluar, $time_stamp, $id]);

                echo json_encode([
                    'success' => true,
                    'message' => 'Data berhasil diupdate',
                    'action' => 'update'
                ]);
                break;

            case 'delete':
                // Validasi input untuk delete
                if (empty($input['id'])) {
                    throw new Exception('ID is required');
                }
                
                $id = $input['id'];

                $sql = "DELETE FROM `cuan` WHERE `id` = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id]);

                echo json_encode([
                    'success' => true,
                    'message' => 'Data berhasil dihapus',
                    'action' => 'delete'
                ]);
                break;

            default:
                throw new Exception('Invalid action');
        }

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database Error: ' . $e->getMessage(),
            'action' => $input['action'] ?? 'unknown'
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'action' => $input['action'] ?? 'unknown'
        ]);
    } catch (Error $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'System Error: ' . $e->getMessage(),
            'action' => $input['action'] ?? 'unknown'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>