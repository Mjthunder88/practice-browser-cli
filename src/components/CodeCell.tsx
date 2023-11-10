import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import bundle from "../bundler";
import Resizable from "./Resizable";

function CodeCell() {
  const [input, setInput] = useState("");
  const [err, setErr] = useState('');
  const [code, setCode] = useState("");

  useEffect(() => {
    const timer = setTimeout( async () => {
      const output = await bundle(input);
      setCode(output.code)
      setErr(output.err)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }

  }, [input])

  // useEffect(() => {
  //   startService();
  // }, []); // * The 2nd arg '[]' just means it will only run this function once when it is first rendered to the dom

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row'}}>
        <Resizable direction="horizontal">
        <CodeEditor
          initialValue="Hello"
          onChange={(value) => setInput(value)}
        />
        </Resizable>
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
}

export default CodeCell;
