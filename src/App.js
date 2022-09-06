import React, {  useState ,useRef} from "react";

import "./App.css";

import FLow from "./FlowBuilder/Flow"

function App() {
  let flowmanagerRef=useRef(FLow())


  console.log("component flow ===>",  flowmanagerRef.current);
  return (
    <div className="App">
      <h1>This is a the flow Component</h1>
      <hr/>
      {flowmanagerRef.current.render()}
    </div>
  );
}

export default App;
