import React from 'react'
import { useRete } from "./rete.js";

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

function FLow() {
    return (
        <div>
          <Editor/>
        </div>
    )
}

export default FLow;
