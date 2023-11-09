
import { useState } from "react";
import CodeEditor from "./CodeEditor";
import Preview from "./Preview";
import bundle from "../bundler";

function CodeCell() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  // useEffect(() => {
  //   startService();
  // }, []); // * The 2nd arg '[]' just means it will only run this function once when it is first rendered to the dom

  const submitCodeHandler = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor initialValue="Hello" onChange={(value) => setInput(value)} />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={submitCodeHandler}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
}

export default CodeCell;