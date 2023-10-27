<?php

class GitHubOAuth
{
    private $client_id;
    private $client_secret;
    private $redirect_uri;
    private $access_token;
    private $api_base_url = 'https://api.github.com';
    private $auth_code;

    public function __construct($client_id, $client_secret, $redirect_uri)
    {
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->redirect_uri = $redirect_uri;
    }

    public function getAuthorizationUrl()
    {
        $params = array(
            'client_id' => $this->client_id,
            'redirect_uri' => $this->redirect_uri,
            'scope' => 'user',
        );

        $query = http_build_query($params);
        return 'https://github.com/login/oauth/authorize?' . $query;
    }

    public function getAccessToken($auth_code)
    {   
  $this->auth_code = $auth_code;
    $token_url = 'https://github.com/login/oauth/access_token';

    $params = array(
        'client_id' => $this->client_id,
        'client_secret' => $this->client_secret,
        'code' => $this->auth_code,
        'redirect_uri' => $this->redirect_uri,
    );

  //print_r($params);

    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($params),
        ),
    );

    $context = stream_context_create($options);
    $response = file_get_contents($token_url, false, $context);
    parse_str($response, $data);

    if (isset($data['access_token'])) {
        return $data['access_token'];
    }

    return false;
    }

    public function refreshAccessToken($refresh_token)
    {
        $params = array(
            'client_id' => $this->client_id,
            'client_secret' => $this->client_secret,
            'refresh_token' => $refresh_token,
        );

        $url = 'https://github.com/login/oauth/access_token';

        $options = array(
            'http' => array(
                'header' => "Accept: application/json\r\n",
                'method' => 'POST',
                'content' => http_build_query($params),
            ),
        );

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        if ($response !== false) {
            $data = json_decode($response, true);
            if (isset($data['access_token'])) {
                $this->access_token = $data['access_token'];
                return $this->access_token;
            }
        }

        return false;
    }

    public function revokeAccessToken($access_token)
    {
        $url = 'https://api.github.com/applications/' . $this->client_id . '/tokens/' . $access_token;

        $options = array(
            'http' => array(
                'header' => "Authorization: token {$this->client_secret}\r\n",
                'method' => 'DELETE',
            ),
        );

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        if ($response !== false) {
            return true;
        }

        return false;
    }
    public function getAuthenticatedUser($access_token) { 
        $apiURL = "https://api.github.com/user"; 

        $ch = curl_init(); 
        curl_setopt($ch, CURLOPT_URL, $apiURL); 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);  
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization: token '. $access_token)); 
        curl_setopt($ch, CURLOPT_USERAGENT, 'CodexWorld GitHub OAuth Login'); 
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET'); 
        $api_response = curl_exec($ch); 
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);          

        if($http_code != 200){ 
            if (curl_errno($ch)) {  
                $error_msg = curl_error($ch);  
            }else{ 
                $error_msg = $api_response; 
            } 
            throw new Exception('Error '.$http_code.': '.$error_msg); 
        }else{ 
            return json_decode($api_response); 
        } 
    } 

    public function getUserData($access_token)
    {
        $url = $this->api_base_url . '/user';

        $options = array(
            'http' => array(
                'header' => "Authorization: token $access_token\r\n",
                'method' => 'GET',
            ),
        );

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        if ($response !== false) {
            $data = json_decode($response, true);
            return $data;
        }

        return false;
    }

    public function getRateLimit()
    {
        $url = $this->api_base_url . '/rate_limit';

        $response = file_get_contents($url);

        if ($response !== false) {
            $data = json_decode($response, true);
            return $data['rate'];
        }

        return false;
    }
}

?>
