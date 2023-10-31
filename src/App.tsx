import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/UnpkgPlugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

function App() {
  const ref = useRef<any>()
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
      return
    }

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    })

    // * Defining will find these instances of variables that haven't been defined in a module and will replace its value with whatever you set it to be.

    setCode(result.outputFiles[0].text);

  };
  // * the target till target what esbuild will try and transpile the users code too

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
    </div>
  );
}

export default App;
