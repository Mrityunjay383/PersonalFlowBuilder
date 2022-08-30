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
  const [visible, setVisible] = useState(true);

  return (
    <div className="App">
      {visible && <Editor />}
    </div>
  );
}

export default App;
