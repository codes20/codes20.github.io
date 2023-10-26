<?php

$token = "ghp_ZL1111jKorKAUf2M1INPsh7qFJV6uQdSKl0HqE6C"; // Your GitHub Personal Access Token
$gist_data = [
    'description' => 'My new Gist',
    'public' => true, // Set to true if you want it to be public, false for private
    'files' => [
        'file.txt' => [
            'content' => 'This is the content of my Gist.'
        ]
    ]
];

$api_url = 'https://api.github.com/gists';

$curl = curl_init($api_url);

$headers = [
    'Authorization: token ' . $token,
    'User-Agent: YourAppName', // Replace with your app name
    'Content-Type: application/json',
];

$data = json_encode($gist_data);

curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

if ($status == 201) {
    $gist = json_decode($response, true);
    $gist_id = $gist['id'];
    $gist_url = $gist['html_url'];
    echo "Gist created successfully. Gist ID: $gist_id, Gist URL: $gist_url";
} else {
    echo "Failed to create Gist. HTTP Status Code: $status";
}
?>
