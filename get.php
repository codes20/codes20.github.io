<?php

$gist_id = $_REQUEST["id"]; // Replace with the Gist ID you want to fetch
$target_filename = "index.html"; // Replace with the filename you want to retrieve

$api_url = "https://api.github.com/gists/$gist_id";

$curl = curl_init($api_url);

$headers = [
    'User-Agent: Codes20', // Replace with your app name
    'Content-Type: application/json',
];

curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

if ($status == 200) {
    $gist = json_decode($response, true);

    $fileExists = false;

    foreach ($gist['files'] as $filename => $file) {
        if ($filename === $target_filename) {
            $fileExists = true;
            //echo "File Name: $filename\n";
            //echo "Content:\n";
            echo $file['content'];
            //echo "\n\n";
        }
    }

    if (!$fileExists) {
        echo "File with the filename '$target_filename' not found in the Gist.";
    }
} else {
    echo "Failed to fetch Gist. HTTP Status Code: $status";
}
?>
