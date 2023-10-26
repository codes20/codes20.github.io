  let editor,code;
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});

  require(["vs/editor/editor.main"], function() {
     editor = monaco.editor.create(document.getElementById('editor'), {
      value: [
        '<!DOCTYPE html>',
        '<html>',
        '  <head>',
        '    <title>Monaco Editor</title>',  
        '  </head>',
        '  <body>',
        '    <p>Hello World!</p>',
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
                                 


