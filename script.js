const urlParams = new URLSearchParams(window.location.search);
function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
function extractIdFromUrl(url) {
    // Define the pattern to match the ID in the URL
    var pattern = /\/([a-f0-9]{32})$/;
  
    // Use the match method to find the match in the URL
    var match = url.match(pattern);
  
    // Check if a match is found
    if (match) {
      // Extract and return the ID
      return match[1];
    } else {
      // Return null if no match is found
      return null;
    }
  }
  
let CodeId = getParameterByName("id") || extractIdFromUrl(window.location.href) ;
let editor,code;
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});

  require(["vs/editor/editor.main"], function() {
     editor = monaco.editor.create(document.getElementById('editor'), {
      value: [
        '<!DOCTYPE html>',
        '<html>',
        '  <head>',
        '    <title>C Editor</title>',  
        '  </head>',
        '<style>',
        '',
        '</style>',
        '  <body>',
        '    <p>Hello World!</p>',
        '',
        '',
        '<script>',
        '',
        '</script>',
        '  </body>',
        '</html>'
      ].join('\n'),
      language: 'html',
      theme: 'vs-dark'
    });
    (localStorage.code)?editor.setValue(localStorage.code):true;
    document.getElementById('preview').srcdoc = editor.getValue();
    editor.onDidChangeModelContent(() => {
     console.log('Value changed!',code);
      code = editor.getValue();
      localStorage.code = code ;
      document.getElementById('preview').srcdoc = code;
      // do something with updated code
    });
  });


  const runbtn = document.getElementById('runbtn');

  runbtn.addEventListener('click', () => {
    const code = editor.getValue();
    console.log(code);
  });

function getGistData(gistId) {
  // GitHub API endpoint for retrieving a specific Gist by ID
  const apiUrl = `https://api.github.com/gists/${gistId}`;

  // Set up the fetch request
  return fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          if (data.id) {
              // Extract the description
              const description = data.description;

              // Extract the content of index.html
              const indexHtmlContent = data.files['index.html'].content;

              // Extract the content of all files
              const allFilesContent = {};
              for (const fileName in data.files) {
                  allFilesContent[fileName] = data.files[fileName].content;
              }

              // Return all the information in an object
              const gistInfo = {
                  description: description,
                  indexHtmlContent: indexHtmlContent,
                  allFilesContent: allFilesContent,
                  gistJson: data
              };

              return gistInfo;
          } else {
              // Gist with the provided ID does not exist
              throw new Error('Gist not found.');
          }
      })
      .catch(error => {
          // Handle errors
          console.error('An error occurred:', error);
          return null;
      });
}



// Get the value of the "id" parameter from the URL
const id = CodeId;
console.log(id);
if(id){
  getGistData(id)
  .then(gistInfo => {
      if (gistInfo) {
          //console.log('Description:', gistInfo.description);
          //console.log('Content of index.html:', gistInfo.indexHtmlContent);
          //console.log('Content of all files:', gistInfo.allFilesContent);
          //console.log('Gist JSON:', gistInfo.gistJson);
        document.title = gistInfo.description;
        document.getElementById('title').value = gistInfo.description;
        editor.setValue(gistInfo.indexHtmlContent);

      } else {
          console.log('Unable to retrieve Gist information.');
      }
  });
}




//--------------------ghp_Psc3jiNSR0--uxcM2SCkQsO0C--Mr5gXOo1rbRIz

let accessToken;

let refreshToken = () => {
if(localStorage.accessToken){
  accessToken = localStorage.accessToken;
} else {
  accessToken = prompt("Enter Your GitHub Access Token :- \n We will not save it", "ForSavingGists");
  if(accessToken != null) localStorage.accessToken = accessToken ;
}

}


let savegist = () => 
    {
      refreshToken();
      // Gist data
      const gistData = {
          description: document.getElementById('title').value || 'Codes20 Gist',
          public: true, // Set to true for public, false for private
          files: {
              'index.html': {
                  content: editor.getValue()
              },
              'codes20.md': {
                  content: 'Codes20 :- https://codes20.github.io./'
              },
              'poster.png': {
                  content: '...'
              }
          }
      };

      // GitHub API endpoint for creating Gists
      const apiUrl = 'https://api.github.com/gists';

      // Set up the fetch request
      fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Authorization': `token ${accessToken}`,
              'User-Agent': 'Codes20', // Replace with your app name
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(gistData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.id) {
              // Gist created successfully
              const gistId = data.id;
              const gistUrl = data.html_url;
              console.log(`Gist created successfully. Gist ID: ${gistId}, Gist URL: ${gistUrl}`);

              // Open the Gist URL in a new window
              window.open(gistUrl, '_blank');
              window.open(location.origin+'/'+gistId, '_blank');
          } else {
              // Failed to create Gist
              console.error('Failed to create Gist.');
              console.log(data);
          }
      })
      .catch(error => {
          console.error('An error occurred:', error);
      });
  }

let updategist = (gistId) => {
  refreshToken();
    // Gist data for updating
    const gistData = {
        description: document.getElementById('title').value || 'Codes20 Gist',
        public: true, // Set to true for public, false for private
        files: {
            'index.html': {
                content: editor.getValue()
            },
            'codes20.md': {
                content: 'Codes20 :- https://codes20.github.io./'
            },
            'poster.png': {
                content: '...'
            }
        }
    };

    // GitHub API endpoint for updating a Gist by ID
    const apiUrl = `https://api.github.com/gists/${gistId}`;

    // Set up the fetch request
    fetch(apiUrl, {
        method: 'PATCH', // Use PATCH to update an existing Gist
        headers: {
            'Authorization': `token ${accessToken}`,
            'User-Agent': 'Codes20', // Replace with your app name
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gistData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            // Gist updated successfully
            const updatedGistId = data.id;
            const gistUrl = data.html_url;
            console.log(`Gist updated successfully. Gist ID: ${updatedGistId}, Gist URL: ${gistUrl}`);

            // Open the updated Gist URL in a new window
            window.open(gistUrl, '_blank');
        } else {
            // Failed to update Gist
            console.error('Failed to update Gist.');
            console.log(data);
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
}

document.getElementById('update').addEventListener('click', () => {
    // Get the gist ID from the URL parameter (you need to implement this)
    const gistId = CodeId;

    if (gistId) {
        updategist(gistId);
    } else {
        console.error('No Gist ID found in the URL parameter.');
    }
});

document.getElementById('save').addEventListener('click', savegist );



if(CodeId){
  document.getElementById('update').style.display = 'inline-block';
  document.getElementById('save').style.display = 'none';
} else {
  document.getElementById('update').style.display = 'none';
  document.getElementById('save').style.display = 'inline-block';
}
