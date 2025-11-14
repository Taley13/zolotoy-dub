<?php
/**
 * 📧 PHP Fallback для контактной формы
 * 
 * Используйте этот скрипт если деплоите Static Export
 * Загрузите в public_html/api/contact.php
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Получить данные
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Валидация
$name = isset($data['name']) ? trim(htmlspecialchars($data['name'])) : '';
$phone = isset($data['phone']) ? trim(htmlspecialchars($data['phone'])) : '';
$email = isset($data['email']) ? trim(htmlspecialchars($data['email'])) : '';
$message = isset($data['message']) ? trim(htmlspecialchars($data['message'])) : '';

if (empty($name)) {
    http_response_code(400);
    echo json_encode(['error' => 'Укажите имя']);
    exit;
}

// ⚙️ НАСТРОЙТЕ ЗДЕСЬ ВАШИ ДАННЫЕ
$botToken = '8397994876:AAHpHKfsdPrEvrGAgIVFGwoOKf6Uw1CPMak'; // Ваш токен
$chatIds = ['277767867', '956005680']; // Ваши chat IDs

// Формируем сообщение
$text = "📩 Новая заявка с сайта «Золотой Дуб»\n\n";
$text .= "👤 Имя: $name\n";
if (!empty($phone)) $text .= "📞 Телефон: $phone\n";
if (!empty($email)) $text .= "📧 Email: $email\n";
if (!empty($message)) $text .= "💬 Сообщение: $message\n";
$text .= "\n🕐 Время: " . date('d.m.Y H:i:s');

// Отправка в Telegram
$successful = 0;
$failed = 0;

foreach ($chatIds as $chatId) {
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    
    $postData = [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $successful++;
    } else {
        $failed++;
    }
}

// Ответ
if ($successful > 0) {
    echo json_encode([
        'ok' => true,
        'message' => 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
        'delivered' => $successful,
        'failed' => $failed,
        'total' => count($chatIds)
    ]);
} else {
    http_response_code(503);
    echo json_encode([
        'error' => 'Временные технические неполадки. Пожалуйста, позвоните нам: 8-930-193-34-20'
    ]);
}
?>

