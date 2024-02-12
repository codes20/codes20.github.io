
      let removeHyphens = (inputString) => inputString.replace(/-/g, "");

      // Replace these values with your GitHub OAuth App credentials
      const clientIdWithHyphens = "660-0b070-3dae-a69-caacc";
      const clientId = removeHyphens(clientIdWithHyphens);
      const redirectUri = "https://codes20.github.io/";
      const scope = "user,gist,repo";

      // Function to initiate GitHub OAuth login
      async function loginWithGitHub() {
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

        // Redirect the user to the GitHub OAuth login page
        window.location.href = authUrl;
      }
      const urlparams = new URLSearchParams(window.location.search);

      // Check if there is an access token in the URL (returned from GitHub OAuth)
      function getGitHubAccessToken() {
        return urlparams.get("access_token");
      }

      // Function to exchange authorization code for access token
      async function exchangeCodeForToken(authorizationCode) {
        try {
          const response = await fetch(
            "https://login-codes20.vercel.app/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                client_id: clientId,
                code: authorizationCode,
                redirect_uri: redirectUri,
              }),
            }
          );

          const data = await response.json();
          const accessToken = data.access_token;
          localStorage.accessToken = accessToken;

          // You now have the access token, you can send it to your server or perform other actions
          console.log("GitHub Access Token:", accessToken);


          if (accessToken) {
            // Access token is present in localStorage
            // You can use the access token to fetch user details or perform other actions
            console.log("GitHub Access Token:", accessToken);

            try {
              // Fetch user details using the access token
              const userResponse = await fetch("https://api.github.com/user", {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              const user = await userResponse.json();
              localStorage.username = user.login;
            } catch (error) {
              console.error("Error fetching user details:", error);
            }
          } else {
            // Access token is not present in localStorage
            // Add your existing logic for initiating GitHub OAuth login
            // ...
            // Example:
            // document.getElementById('login-button').addEventListener('click', loginWithGitHub);
          }

          // Creating the iframe element
          //location.href = "../";
        } catch (error) {
          console.error(
            "Error exchanging authorization code for access token:",
            error
          );
        }
      }
      const authorizationCode = getGitHubAccessToken();
      if (urlparams.get("code")) {
        exchangeCodeForToken(urlparams.get("code"));
      }
      // Example usage
      document
        .getElementById("login-button")
        .addEventListener("click", async () => {
          // If there is an authorization code in the URL, exchange it for an access token
          if (authorizationCode) {
            exchangeCodeForToken(authorizationCode);
          } else {
            // If there is no authorization code, initiate the GitHub OAuth login
            loginWithGitHub();
          }
        });

        if(localStorage.accessToken && !undefined) {
          document.getElementById("login-button").href = "./user.html";
          document.getElementById("login-button").innerHTML = "ACCOUNT";
        }