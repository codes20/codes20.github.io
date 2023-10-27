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

  let save = () => {

  }


// Get the value of the "id" parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
if(id){
  // Replace the contents of the editor with the contents of the file with the given ID
  fetch(`get.php?id=${id}`)
    .then(response => response.text())
    .then(data => {
      editor.setValue(data);
    });
}
                                 



//--------------------

// Replace with your GitHub Personal Access Token
let accessToken = 'ghp_BaESolgh0Vupka'
    accessToken += 'JpGC6EDKwtxeQfqH2JsK4D';
console.log(accessToken);


document.getElementById('save').addEventListener('click', () => {
    // Gist data
    const gistData = {
        description: document.getElementById('title').value || 'Codes20 Gist',
        public: true, // Set to true for public, false for private
        files: {
            'index.html': {
                content: editor.getValue()
            },
            'codes20.txt': {
                content: '...'
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
            window.open('https://codes20githubio.sh20raj.repl.co/?id='+gistId, '_blank');
        } else {
            // Failed to create Gist
            console.error('Failed to create Gist.');
            console.log(data);
        }
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });
});
