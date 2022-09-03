import React, {  useState } from "react";

import "./App.css";

import FLow from "./FlowBuilder/Flow"

function App() {

  return (
    <div className="App">
      <h1>This is a the flow Component</h1>
      <hr/>
      <FLow />
    </div>
  );
}

export default App;
