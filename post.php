<?php
session_start();

// Replace with your GitHub Personal Access Token
$access_token = 'ghp_dhJH7WA5K3QGsT8VI';
$access_token += 'Sor4E9KZ7Vjtf4Orm7i';

// Gist data
$gist_data = [
    'description' => 'My new Gist',
    'public' => true, // Set to true for public, false for private
    'files' => [
        'index.html' => [
            'content' => 'This is the content of my Gist.'
        ],
        'codes20.txt' => [   // Add the 'style.css' file
            'content' => '/* Your CSS styles go here */'
        ],
        'poster.png' => [
            'content' => 'This is the content of my Gist.'
        ]
    ]
];

// GitHub API endpoint for creating Gists
$api_url = 'https://api.github.com/gists';

// Initialize cURL session
$curl = curl_init($api_url);

// Set HTTP headers
$headers = [
    'Authorization: token ' . $access_token,
    'User-Agent: Codes20', // Replace with your app name
    'Content-Type: application/json',
];

// JSON encode Gist data
$data = json_encode($gist_data);

// Set cURL options
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// Execute the cURL request
$response = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

// Close the cURL session
curl_close($curl);

// Check the HTTP status code
if ($status == 201) {
    // Gist created successfully
    $gist = json_decode($response, true);
    $gist_id = $gist['id'];
    $gist_url = $gist['html_url'];
    echo "Gist created successfully. Gist ID: $gist_id, Gist URL: $gist_url";
  print_r($gist);
} else {
    // Failed to create Gist
    echo "Failed to create Gist. HTTP Status Code: $status";
  print_r($response);
}
?>
