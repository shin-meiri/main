<?php
// Set header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$file = __DIR__ . '/db.json';

// === BANTUAN: Baca konfigurasi ===
function readConfig() {
    global $file;
    if (!file_exists($file)) return ['host' => '', 'user' => '', 'pass' => '', 'dbname' => ''];
    $content = file_get_contents($file);
    $json = json_decode($content, true);
    return json_last_error() === JSON_ERROR_NONE ? $json : ['host' => '', 'user' => '', 'pass' => '', 'dbname' => ''];
}

// === DELETE: Reset db.json ===
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $default = ['host' => '', 'user' => '', 'pass' => '', 'dbname' => ''];
    $result = file_put_contents($file, json_encode($default, JSON_PRETTY_PRINT));
    echo json_encode($result ? ['status' => 'deleted'] : ['status' => 'error']);
    exit;
}

// === POST: Simpan konfigurasi ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (empty($input['host']) || empty($input['user'])) {
        echo json_encode(['status' => 'error', 'message' => 'Host dan user wajib']);
        exit;
    }

    // Simpan dulu
    if (!file_put_contents($file, json_encode($input, JSON_PRETTY_PRINT))) {
        echo json_encode(['status' => 'error', 'message' => 'Gagal simpan']);
        exit;
    }

    // Coba koneksi PDO
    try {
        $pdo = new PDO(
            "mysql:host={$input['host']};dbname={$input['dbname']};charset=utf8",
            $input['user'],
            $input['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        echo json_encode(['status' => 'saved', 'connection' => ['status' => 'connected']]);
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'saved',
            'connection' => ['status' => 'failed', 'error' => $e->getMessage()]
        ]);
    }
    exit;
}

// === BACA KONFIG & BUAT KONEKSI PDO ===
$config = readConfig();
if (empty($config['host']) || empty($config['user'])) {
    echo json_encode(['status' => 'disconnected']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8",
        $config['user'],
        $config['pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    echo json_encode(['status' => 'failed', 'error' => $e->getMessage()]);
    exit;
}

// === GET: Daftar tabel ===
if (isset($_GET['tables']) && $_GET['tables'] === 'true') {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode(['tables' => $tables]);
    exit;
}

// === GET: Semua data dari tabel ===
if (isset($_GET['tabel']) && !isset($_GET['search'])) {
    $table = $pdo->quote($config['dbname'] . '.' . $_GET['tabel']);
    $table_name = $_GET['tabel'];

    $stmt = $pdo->prepare("SELECT * FROM `$table_name` LIMIT 100");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($rows === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Tabel tidak ditemukan']);
        exit;
    }

    $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table_name`");
    $stmt->execute();
    $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $columns = array_column($fields, 'Field');

    echo json_encode([
        'columns' => $columns,
        'data' => $rows
    ]);
    exit;
}

// === GET: Pencarian data ===
if (isset($_GET['tabel']) && isset($_GET['search'])) {
    $table = $_GET['tabel'];
    $search = trim($_GET['search']);

    $query = "SELECT * FROM `$table`";
    if (!empty($search)) {
        $query .= " WHERE ";
        $stmt = $pdo->prepare("SHOW COLUMNS FROM `$table`");
        $stmt->execute();
        $fields = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conditions = [];
        foreach ($fields as $f) {
            $fname = $f['Field'];
            $conditions[] = "`$fname` LIKE ?";
        }
        $query .= implode(' OR ', $conditions);
    }

    $stmt = $pdo->prepare($query . " LIMIT 50");
    
    if (!empty($search)) {
        $params = array_fill(0, count($conditions), "%$search%");
        $stmt->execute($params);
    } else {
        $stmt->execute();
    }

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['data' => $rows]);
    exit;
}

// === POST: Simpan atau Hapus Data ===
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $table = $input['tabel'] ?? '';
    $data = $input['data'] ?? [];
    $mode = $input['mode'] ?? 'insert';

    if (empty($table) || empty($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
        exit;
    }

    try {
        // 🔴 DELETE
        if ($mode === 'delete') {
            $id = (int)($data['id'] ?? 0);
            if ($id === 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID tidak valid']);
                exit;
            }
            $stmt = $pdo->prepare("DELETE FROM `$table` WHERE `id` = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true, 'message' => 'Data dihapus']);
            exit;
        }

        // 💾 INSERT
        if ($mode === 'insert') {
            $keys = array_keys($data);
            $placeholders = str_repeat('?,', count($keys) - 1) . '?';
            $sql = "INSERT INTO `$table` (`" . implode('`,`', $keys) . "`) VALUES ($placeholders)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($data));
            $newId = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $newId]);
            exit;
        }

        // 🔄 UPDATE
        if ($mode === 'update' && !empty($data['id'])) {
            $id = (int)$data['id'];
            unset($data['id']);
            $sets = implode(' = ?, ', array_keys($data)) . ' = ?';
            $sql = "UPDATE `$table` SET $sets WHERE `id` = $id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($data));
            echo json_encode(['success' => true, 'id' => $id]);
            exit;
        }

        http_response_code(400);
        echo json_encode(['error' => 'Mode tidak dikenali']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// === Default: Connected
echo json_encode(['status' => 'connected']);
?>
