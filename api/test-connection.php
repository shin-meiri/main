<?php
// api/test-connection.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Terima data dari request
        $input = json_decode(file_get_contents('php://input'), true);
        
        error_log("test-connection input: " . json_encode($input));

        $host = $input['host'] ?? '';
        $dbname = $input['dbname'] ?? '';
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        // Validasi input
        if (empty($host) || empty($dbname) || empty($username)) {
            throw new Exception('Host, database name, and username are required');
        }

        // Buat koneksi ke MySQL menggunakan PDO
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 5
        ];
        
        error_log("Attempting connection to: $dsn");
        
        // Coba koneksi
        $pdo = new PDO($dsn, $username, $password, $options);
        error_log("Connection created successfully");

        // Test dengan query sederhana
        $stmt = $pdo->query("SELECT 1");
        $stmt->fetch();
        error_log("Connection test successful");
        
        echo json_encode([
            'success' => true,
            'message' => 'Koneksi berhasil!',
            'database' => $dbname,
            'connected' => true
        ]);

    } catch (PDOException $e) {
        error_log("PDOException: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Koneksi gagal: ' . $e->getMessage()
        ]);
    } catch (Exception $e) {
        error_log("Exception: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    } catch (Error $e) {
        error_log("Error: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'System Error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>