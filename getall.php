get<?php

$gist_id = "b826243c4d043c86ca23b29a86f5aa81"; // Replace with the Gist ID you want to fetch

$api_url = "https://api.github.com/gists/$gist_id";

$curl = curl_init($api_url);

$headers = [
    'User-Agent: YourAppName', // Replace with your app name
    'Content-Type: application/json',
];

curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

if ($status == 200) {
    $gist = json_decode($response, true);
    foreach ($gist['files'] as $file) {
        $filename = $file['filename'];
        $content = $file['content'];
        echo "File Name: $filename\n";
        echo "Content:\n";
        echo $content;
        echo "\n\n";
    }
} else {
    echo "Failed to fetch Gist. HTTP Status Code: $status";
}
?>
