import React, {  useState ,useRef} from "react";

import "./App.css";
import { publish, subscribe } from "./FlowBuilder/events";

import FLow from "./FlowBuilder/Flow"


function App() {
  let flowmanagerRef=useRef(FLow())
subscribe("say-hello",()=>{
  console.log("say-hello");
});

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
