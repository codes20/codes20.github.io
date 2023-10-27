<?php
session_start();

require_once 'GitHubOAuth.php';

$client_id = '6600b0703daea69caacc';
$client_secret = 'cacf5c4f3167fe160dd'
  $client_secret += '56b193f95232c0415a5be';
$redirect_uri = 'https://codes20githubio.sh20raj.repl.co/login.php';

$github_oauth = new GitHubOAuth($client_id, $client_secret, $redirect_uri);

$authorization_url = $github_oauth->getAuthorizationUrl();

// Display the login button or redirect the user to the authorization URL
echo '<hr><a href="' . $authorization_url . '">Login with GitHub</a><hr>';



if (isset($_GET['code'])) {
    $auth_code = $_GET['code'];

    $access_token = $github_oauth->getAccessToken($auth_code);

    if ($access_token !== false) {
        $_SESSION['access_token'] = $access_token;

        // Redirect the user to the desired page
        //header('Location: welcome.php');
//exit;
    } else {
        //echo 'Failed to obtain access token';
    }
}


if (isset($_SESSION['access_token'])) {
    $access_token = $_SESSION['access_token'];

    $user_data = $github_oauth->getAuthenticatedUser($access_token);

    if ($user_data !== false) {
        // Process user data as needed
        echo 'User ID: ' . $user_data->id . '<br>';
        echo 'Login: ' . $user_data->login . '<br>';
      echo 'Name: ' . $user_data->name . '<br>';
      echo 'Company: ' . $user_data->company . '<br>';
      echo '<a href="logout.php">Logout</a>';
        // ...
    } else {
        echo 'Failed to retrieve user data from GitHub';
    }
} else {
   // echo 'Access token not found';
}
?>