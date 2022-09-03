import React from 'react'
import { useRete } from "./rete.js";

function Editor() {
  const [setContainer] = useRete();
  const handleClick=(e)=>{
     console.log(e);
  }
  return (
    <>
    <div
      style={{
        width: "100vw",
        height: "80vh"
      }}
      ref={(ref) => ref && setContainer(ref)}
    >
      <div>
        <input type="button" value="Action" onClick={handleClick}/>
      </div>
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
