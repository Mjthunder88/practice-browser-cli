import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/UnpkgPlugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  //* This is the initlization for esbuild. It goes into the public foulder and grabs the esbuild.wasm file
  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };
  useEffect(() => {
    startService();
  }, []); // * The 2nd arg '[]' just means it will only run this function once when it is first rendered to the dom

  const submitCodeHandler = async () => {
    if (!ref.current) {
      return;
    }

    // * Resets the iframe before it transpiles and bundles the code the user put in.
    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    // * Defining will find these instances of variables that haven't been defined in a module and will replace its value with whatever you set it to be.

    // setCode(result.outputFiles[0].text);

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };
  // * the target till target what esbuild will try and transpile the users code too

  const html = `
  <html>
    <head></head>
    <body>
    <div id="root"></div>  
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtim Error</h4>' + err + '</div>'
            console.error(err);
          }
        }, false);
      </script>
    </body>
  </html>
`;

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={submitCodeHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
}

export default App;
