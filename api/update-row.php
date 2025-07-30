<?php
// api/update-row.php

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
        
        $host = $input['host'] ?? '';
        $dbname = $input['dbname'] ?? '';
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $table = $input['table'] ?? '';
        $data = $input['data'] ?? [];
        $primaryKey = $input['primaryKey'] ?? '';

        // Validasi input
        if (empty($host) || empty($dbname) || empty($username) || empty($table) || empty($data)) {
            throw new Exception('Host, database name, username, table, and data are required');
        }

        // Buat koneksi ke MySQL menggunakan PDO
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_TIMEOUT => 10
        ];
        
        $pdo = new PDO($dsn, $username, $password, $options);

        // Bangun query UPDATE
        $setParts = [];
        $values = [];
        
        foreach ($data as $field => $value) {
            if ($field !== $primaryKey) { // Jangan update primary key
                $setParts[] = "`$field` = :$field";
                $values[$field] = $value;
            }
        }
        
        // Tambahkan primary key untuk WHERE clause
        $primaryKeyValue = $data[$primaryKey] ?? '';
        $values['pk_value'] = $primaryKeyValue;

        if (empty($setParts)) {
            throw new Exception('No fields to update');
        }

        $setClause = implode(', ', $setParts);
        $sql = "UPDATE `$table` SET $setClause WHERE `$primaryKey` = :pk_value";

        // Eksekusi query
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute($values);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Row updated successfully',
                'affected_rows' => $stmt->rowCount()
            ]);
        } else {
            throw new Exception('Failed to update row');
        }

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Database Error: ' . $e->getMessage()
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ]);
}
?>