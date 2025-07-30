<?php
// api/dat.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Terima data dari request
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Baca data yang sudah ada
    $existingData = [];
    if (file_exists('dat.json')) {
        $existingData = json_decode(file_get_contents('dat.json'), true);
    }
    
    // Gabungkan data baru dengan data yang sudah ada
    // Jika dbConfig tidak ada di input, gunakan yang lama
    $mergedData = array_merge($existingData, $input);
    
    // Simpan ke dat.json
    file_put_contents('dat.json', json_encode($mergedData, JSON_PRETTY_PRINT));
    
    echo json_encode(['status' => 'success', 'data' => $mergedData]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Untuk GET request, kirim data yang sudah ada
    if (file_exists('dat.json')) {
        echo file_get_contents('dat.json');
    } else {
        // Jika file belum ada, buat dengan data default
        $defaultData = [
            'message' => 'welcome',
            'users' => [],
            'dbConfig' => [
                'host' => '',
                'dbname' => '',
                'tabel' => ''
            ]
        ];
        file_put_contents('dat.json', json_encode($defaultData, JSON_PRETTY_PRINT));
        echo json_encode($defaultData);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>