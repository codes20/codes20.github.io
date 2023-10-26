const html = document.getElementById("html");
const css = document.getElementById("css");
const js = document.getElementById("js");
const result = document.getElementById("result");

const updatePreview = () => {
  result.contentDocument.body.innerHTML = html.value;
  result.contentDocument.head.innerHTML = `<style>${css.value}</style>`;
  result.contentWindow.eval(js.value);
}

html.addEventListener("input", updatePreview);
css.addEventListener("input", updatePreview);  
js.addEventListener("input", updatePreview);