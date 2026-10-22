<?php
/**
 * Callback form relay.
 *
 * The browser posts the callback form here (same origin). This script checks
 * the input and forwards it to the Leads API with the secret API key, so the
 * key never appears in public HTML or JavaScript.
 *
 * SETUP (one time, on the server):
 *   Create a file named leads-config.php ONE LEVEL ABOVE the public web root
 *   (for cPanel: in /home/<account>/, next to public_html, not inside it):
 *
 *     <?php
 *     return [
 *         'endpoint' => 'https://labmate.bhasinpathlabs.com:4672/api/v1/leads',
 *         'api_key'  => 'PASTE-THE-NEW-API-KEY-HERE',
 *     ];
 *
 *   Alternatively set the environment variables LEADS_API_ENDPOINT and
 *   LEADS_API_KEY. Because the previous key was published in the old
 *   callback-form.html, generate a new key before going live.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// Only accept submissions sent from this website.
$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
$origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $originPort = parse_url($origin, PHP_URL_PORT);
    if ($originPort !== null) {
        $originHost .= ':' . $originPort;
    }
    if ($originHost !== $host) {
        respond(403, ['ok' => false, 'error' => 'forbidden']);
    }
}

// Honeypot: real visitors never see or fill this field. Pretend success.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(200, ['ok' => true]);
}

$allowedHelp = [
    'Home collection',
    'Doctor or institution',
    'Centre visit',
    'Health check-up',
    'Test information',
    'CGHS service',
    'Report support',
];

$name = trim(preg_replace('/\s+/', ' ', (string) ($_POST['name'] ?? '')) ?? '');
$phone = preg_replace('/\D+/', '', (string) ($_POST['mobile'] ?? '')) ?? '';
if (strlen($phone) === 12 && strpos($phone, '91') === 0) {
    $phone = substr($phone, 2);
}
$helpWith = trim((string) ($_POST['helpWith'] ?? ''));
$source = (($_POST['source'] ?? '') === 'flu-test') ? 'flu-test' : '';
$consent = (($_POST['consent'] ?? '') === 'yes');

if ($name === '' || strlen($name) > 120) {
    respond(422, ['ok' => false, 'error' => 'invalid_name']);
}
if (!preg_match('/^[6-9][0-9]{9}$/', $phone)) {
    respond(422, ['ok' => false, 'error' => 'invalid_mobile']);
}
if (!in_array($helpWith, $allowedHelp, true)) {
    $helpWith = 'Home collection';
}
if (!$consent) {
    respond(422, ['ok' => false, 'error' => 'consent_required']);
}

// Simple rate limit: at most 5 submissions per IP address per 10 minutes.
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
    . 'bhl-callback-' . hash('sha256', $ip) . '.json';
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $decoded = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($decoded)) {
        $hits = $decoded;
    }
}
$hits = array_values(array_filter($hits, function ($t) use ($now) {
    return is_int($t) && $t > $now - 600;
}));
if (count($hits) >= 5) {
    respond(429, ['ok' => false, 'error' => 'too_many_requests']);
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);

// Load the endpoint and key from outside the web root (see SETUP above).
$config = [];
$docRoot = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
$configFile = ($docRoot !== '' ? dirname(rtrim($docRoot, '/\\')) : dirname(__DIR__, 3))
    . DIRECTORY_SEPARATOR . 'leads-config.php';
if (is_file($configFile)) {
    $loaded = require $configFile;
    if (is_array($loaded)) {
        $config = $loaded;
    }
}
$endpoint = (string) ($config['endpoint'] ?? (getenv('LEADS_API_ENDPOINT') ?: ''));
$apiKey = (string) ($config['api_key'] ?? (getenv('LEADS_API_KEY') ?: ''));

if ($endpoint === '' || $apiKey === '' || !function_exists('curl_init')) {
    error_log('Callback form relay is not configured (missing leads-config.php, API key or PHP cURL).');
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}

$remarks = implode('/', array_filter([$helpWith, $source]));

$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => [
        'name' => $name,
        'phone' => $phone,
        'remarks' => $remarks,
    ],
    CURLOPT_HTTPHEADER => ['X-API-Key: ' . $apiKey],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_TIMEOUT => 15,
]);
$response = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($response === false || $status < 200 || $status >= 300) {
    error_log('Callback form relay: Leads API failed (HTTP ' . $status . ') ' . $curlError);
    respond(502, ['ok' => false, 'error' => 'upstream_failed']);
}

respond(200, ['ok' => true]);
