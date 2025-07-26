<?php
// backend/api/konek.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class DatabaseConnector {
    private $connection;
    
    // Method untuk koneksi ke database apapun
    public function connect($host, $username, $password, $database) {
        try {
            $this->connection = new PDO(
                "mysql:host={$host};dbname={$database};charset=utf8",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
            return true;
        } catch(PDOException $e) {
            throw new Exception("Connection failed: " . $e->getMessage());
        }
    }
    
    // Method untuk test koneksi
    public function testConnection($host, $username, $password, $database) {
        try {
            $test_conn = new PDO(
                "mysql:host={$host};dbname={$database};charset=utf8",
                $username,
                $password,
                [PDO::ATTR_TIMEOUT => 5]
            );
            return ['status' => 'success', 'message' => 'Connected successfully'];
        } catch(PDOException $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    
    // Method untuk menjalankan query
    public function executeQuery($query, $params = []) {
        try {
            $stmt = $this->connection->prepare($query);
            $stmt->execute($params);
            
            // Deteksi jenis query
            $query_type = strtoupper(substr(trim($query), 0, 6));
            
            if ($query_type === 'SELECT') {
                return $stmt->fetchAll();
            } else {
                return ['affected_rows' => $stmt->rowCount()];
            }
        } catch(PDOException $e) {
            throw new Exception("Query failed: " . $e->getMessage());
        }
    }
    
    // Method untuk mendapatkan struktur tabel
    public function getTableStructure($database) {
        $query = "SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
                  FROM INFORMATION_SCHEMA.COLUMNS 
                  WHERE TABLE_SCHEMA = :database 
                  ORDER BY TABLE_NAME, ORDINAL_POSITION";
        return $this->executeQuery($query, [':database' => $database]);
    }
}

// Proses request
try {
    $connector = new DatabaseConnector();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Terima data koneksi dari React
        $input = json_decode(file_get_contents("php://input"), true);
        
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'test_connection':
                    // Test koneksi database
                    $result = $connector->testConnection(
                        $input['host'],
                        $input['username'],
                        $input['password'],
                        $input['database']
                    );
                    echo json_encode($result);
                    break;
                    
                case 'connect_and_query':
                    // Koneksi dan jalankan query
                    $connector->connect(
                        $input['host'],
                        $input['username'],
                        $input['password'],
                        $input['database']
                    );
                    
                    $result = $connector->executeQuery($input['query'], $input['params'] ?? []);
                    echo json_encode([
                        'status' => 'success',
                        'data' => $result
                    ]);
                    break;
                    
                case 'get_structure':
                    // Dapatkan struktur database
                    $connector->connect(
                        $input['host'],
                        $input['username'],
                        $input['password'],
                        $input['database']
                    );
                    
                    $structure = $connector->getTableStructure($input['database']);
                    echo json_encode([
                        'status' => 'success',
                        'structure' => $structure
                    ]);
                    break;
                    
                default:
                    throw new Exception('Invalid action');
            }
        } else {
            throw new Exception('No action specified');
        }
    } else {
        // Response default
        echo json_encode([
            'message' => 'Database Connector API',
            'version' => '1.0',
            'available_actions' => [
                'test_connection',
                'connect_and_query',
                'get_structure'
            ]
        ]);
    }
} catch(Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>