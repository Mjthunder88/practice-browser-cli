import { useState } from 'react'


function App() {

const [input, setInput] = useState('')
const [code, setCode] = useState('')

const submitCodeHandler = () =>  {
    return console.log(input)
}


  return (
    <div>
      <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
      <div>
        <button onClick={submitCodeHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export default App;
