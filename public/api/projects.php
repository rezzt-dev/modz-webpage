<?php
// Polyfill para getallheaders() si no existe (común en Nginx/FPM)
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

// Configuración
$dataFile = 'projects.json';
// La contraseña se envía en el header 'X-Auth-Token'
// En producción, cambia esto por una contraseña robusta o variable de entorno
$validToken = 'valid_session'; 

// Headers CORS
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

header('Content-Type: application/json');

// GET: Leer datos
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        echo file_get_contents($dataFile);
    } else {
        echo '[]'; // Array vacío si no existe
    }
    exit;
}

// POST: Guardar datos
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headers = getallheaders();
    
    // Buscar el token en diferentes variantes de headers por si acaso
    $token = '';
    if (isset($headers['X-Auth-Token'])) $token = $headers['X-Auth-Token'];
    elseif (isset($headers['x-auth-token'])) $token = $headers['x-auth-token']; // Lowercase check
    elseif (isset($_SERVER['HTTP_X_AUTH_TOKEN'])) $token = $_SERVER['HTTP_X_AUTH_TOKEN']; // Fallback directo
    
    // Hash BCRYPT (Placeholder)
    $adminPass = '9%aE#dy78g$*hZ6Qq%Pa9zNgBz&9H##QU!';

    // Verificación
    if ($token !== $adminPass) {
        http_response_code(403);
        echo json_encode([
            'error' => 'Unauthorized', 
            'detail' => 'Invalid Token',
            // 'debug_received' => substr($token, 0, 3) . '...' // Uncomment for extreme debugging
        ]);
        exit;
    }
    
    $input = file_get_contents('php://input');
    
    // Validar que sea JSON válido
    if (json_decode($input) === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload']);
        exit;
    }

    // Guardar
    if (file_put_contents($dataFile, $input) !== false) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode([
            'error' => 'Failed to write file',
            'detail' => 'Check file permissions (chmod 775)',
            'path' => realpath($dataFile)
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
