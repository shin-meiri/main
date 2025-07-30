<?php
// api/get-table-data.php

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
        
        // Log input untuk debugging
        error_log("get-table-data input: " . json_encode($input));

        $host = $input['host'] ?? '';
        $dbname = $input['dbname'] ?? '';
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $table = $input['table'] ?? '';

        // Validasi input
        if (empty($host) || empty($dbname) || empty($username) || empty($table)) {
            throw new Exception('Host, database name, username, and table are required. Received: host=' . $host . ', dbname=' . $dbname . ', username=' . $username . ', table=' . $table);
        }

        // Buat koneksi ke MySQL menggunakan PDO
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 10
        ];
        
        error_log("Attempting connection to: $dsn");
        
        $pdo = new PDO($dsn, $username, $password, $options);
        error_log("Connection successful");

        // Test koneksi dulu
        $stmt = $pdo->query("SELECT 1");
        $stmt->fetch();
        error_log("Connection test successful");

        // Dapatkan data dari tabel (batasi 100 baris untuk performa)
        $sql = "SELECT * FROM `" . str_replace('`', '', $table) . "` LIMIT 100";
        error_log("Executing query: $sql");
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll();
        error_log("Query executed, found " . count($data) . " rows");

        // Dapatkan nama kolom
        if (!empty($data)) {
            $columns = array_keys($data[0]);
        } else {
            // Jika tidak ada data, dapatkan struktur kolom
            $descSql = "DESCRIBE `" . str_replace('`', '', $table) . "`";
            error_log("Getting table structure: $descSql");
            $stmt = $pdo->prepare($descSql);
            $stmt->execute();
            $desc = $stmt->fetchAll();
            $columns = array_column($desc, 'Field');
            error_log("Got " . count($columns) . " columns");
        }

        // Response sukses
        $response = [
            'success' => true,
            'data' => $data,
            'columns' => $columns,
            'rowCount' => count($data),
            'table' => $table
        ];
        
        error_log("Sending response: " . json_encode($response));
        echo json_encode($response);

    } catch (PDOException $e) {
        error_log("PDOException: " . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Database Error: ' . $e->getMessage()
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