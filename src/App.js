import React, {  useState } from "react";
import { useRete } from "./rete.js";

import "./App.css";

function Editor() {
  const [setContainer] = useRete();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh"
      }}
      ref={(ref) => ref && setContainer(ref)}
    />
  );
}

function App() {

  return (
    <div className="App">
      <h1>This is a the flow Component</h1>
      <Editor/>
    </div>
  );
}

export default App;
