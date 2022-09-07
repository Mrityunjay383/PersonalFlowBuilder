import React from 'react'
import { useRete } from "./rete.js";

function Editor({data}) {

  const [setContainer] = useRete(data);
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

function FLow(props) {

    return ({
        hello : function(){
          console.log("hello");
        },
        render:function(){
          return <Editor  data={props} />
        },
        on:function(eventName, listener){ 
            document.addEventListener(eventName, listener);
     
        }
      }
    )
}

export default FLow;
