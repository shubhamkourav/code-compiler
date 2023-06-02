import React, { useState } from "react";
import Sk from "skulpt";
import AceEditor from "react-ace";

// Import the desired Ace Editor mode and theme
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const PythonCompiler = () => {
  const [pythonCode, setPythonCode] = useState("");
  const [output, setOutput] = useState("");

  const handleCodeChange = (value) => {
    setPythonCode(value);
  };

  const handleCompile = () => {
    Sk.configure({
      output: (text) => {
        setOutput((prevOutput) => prevOutput + text);
      },
      read: (filename) => {
        if (
          Sk.builtinFiles === undefined ||
          Sk.builtinFiles["files"][filename] === undefined
        )
          throw `File not found: '${filename}'`;
        return Sk.builtinFiles["files"][filename];
      },
    });

    Sk.misceval
      .asyncToPromise(() => {
        return Sk.importMainWithBody("<stdin>", false, pythonCode, true);
      })
      .catch((error) => {
        setOutput(`Error: ${error}`);
      });
  };

  return (
    <div>
      <h2>Python Compiler</h2>
      <div style={{ display: "flex"}}>
        <AceEditor
          mode="python" 
          theme="monokai"
          onChange={handleCodeChange} 
          value={pythonCode}
          placeholder="Enter Python code" 
          width="50%"
          height="80vh" 
          fontSize={14} 
          showPrintMargin={false} 
          showGutter={true} 
        />
        <div style={{ marginLeft: "10px", backgroundColor:"black", color:"white",width:"50%" }}>
          <pre>{output}</pre>
        </div>
      </div>

      <button
        style={{ width: "100px", marginTop: "10px" }}
        onClick={handleCompile}
      >
        Compile
      </button>
    </div>
  );
};

export default PythonCompiler;
