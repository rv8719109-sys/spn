<?php
// geo.php — GEO Offer Redirect Router + India stays on lander (popup click redirects)

// --------------------
// NO CACHE
// --------------------
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

// --------------------
// Helpers
// --------------------
function first_ip($s) {
  $p = explode(',', $s);
  return trim($p[0]);
}

function client_ip() {
  if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return $_SERVER['HTTP_CF_CONNECTING_IP'];
  if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return first_ip($_SERVER['HTTP_X_FORWARDED_FOR']);
  if (!empty($_SERVER['HTTP_X_REAL_IP'])) return $_SERVER['HTTP_X_REAL_IP'];
  return $_SERVER['REMOTE_ADDR'] ?? '';
}

function get_json($url, $timeout = 4) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_CONNECTTIMEOUT => $timeout,
      CURLOPT_TIMEOUT => $timeout,
      CURLOPT_USERAGENT => 'geo-router/1.0',
      CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body && $code >= 200 && $code < 300) {
      $j = json_decode($body, true);
      return is_array($j) ? $j : null;
    }
    return null;
  }

  $ctx = stream_context_create([
    'http' => [
      'timeout' => $timeout,
      'header' => "User-Agent: geo-router/1.0\r\n"
    ]
  ]);
  $body = @file_get_contents($url, false, $ctx);
  if (!$body) return null;

  $j = json_decode($body, true);
  return is_array($j) ? $j : null;
}

// --------------------
// Country detection
// --------------------
$ip = client_ip();

$country = '';
if (!empty($_SERVER['HTTP_CF_IPCOUNTRY']) && $_SERVER['HTTP_CF_IPCOUNTRY'] !== 'XX') {
  $country = strtoupper($_SERVER['HTTP_CF_IPCOUNTRY']);
}

if (!$country) {
  $j = get_json('https://ipwho.is/' . urlencode($ip));
  if ($j && !empty($j['country_code'])) $country = strtoupper($j['country_code']);
}

if (!$country) {
  $j = get_json('https://ipapi.co/' . urlencode($ip) . '/json/');
  if ($j && !empty($j['country_code'])) $country = strtoupper($j['country_code']);
}

// --------------------
// Offers
// --------------------
$offerCA = "https://inf4hub.com/?utm_campaign=Ple4hpr7z0&v1=[v1]&v2=[v2]&v3=[v3]";
$offerNZ = "https://h2n6.com/?utm_campaign=d5sjRjL1yk&v1=[v1]&v2=[v2]&v3=[v3]";
$default = "/game.html";

// --------------------
// Special: INDIA => no auto redirect
// Instead return JSON so frontend popup controls redirect
// --------------------
if ($country === 'IN') {
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode([
    "country" => "IN",
    "redirect" => false
  ]);
  exit;
}

// CA => auto redirect
if ($country === 'CA') {
  header("Location: $offerCA", true, 302);
  exit;
}

// NZ => auto redirect
if ($country === 'NZ') {
  header("Location: $offerNZ", true, 302);
  exit;
}

// All others => fallback
header("Location: $default", true, 302);
exit;
