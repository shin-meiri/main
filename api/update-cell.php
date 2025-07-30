<?php
// api/update-cell.php

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
        
        error_log("update-cell input: " . json_encode($input));

        $host = $input['host'] ?? '';
        $dbname = $input['dbname'] ?? '';
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $table = $input['table'] ?? '';
        $columnName = $input['columnName'] ?? '';
        $value = $input['value'] ?? '';
        $primaryKey = $input['primaryKey'] ?? '';
        $primaryKeyValue = $input['primaryKeyValue'] ?? '';

        // Validasi input
        if (empty($host) || empty($dbname) || empty($username) || empty($table) || 
            empty($columnName) || empty($primaryKey) || empty($primaryKeyValue)) {
            throw new Exception('Required fields are missing');
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

        // Bangun query UPDATE
        $sql = "UPDATE `$table` SET `$columnName` = :value WHERE `$primaryKey` = :pk_value";
        error_log("Executing query: $sql");

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':value', $value);
        $stmt->bindValue(':pk_value', $primaryKeyValue);
        
        $result = $stmt->execute();

        if ($result && $stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Cell updated successfully',
                'affected_rows' => $stmt->rowCount()
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => 'No rows affected (value might be the same)',
                'affected_rows' => 0
            ]);
        }

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