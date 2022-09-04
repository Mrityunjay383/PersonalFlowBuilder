import React from 'react'
import { useRete } from "./rete.js";

function Editor() {
  const [setContainer] = useRete();
  return (
    <>
    <div
      style={{
        backgroundColor:"rgb(242,245,247)",
        width: "100vw",
        height: "80vh"
      }}
      ref={(ref) => ref && setContainer(ref)}
    >

    </div>
    </>

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
