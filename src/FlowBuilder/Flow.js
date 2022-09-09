import React, { useState } from "react";
import { publish, subscribe } from "./events.js";
import { useRete } from "./rete.js";

function Editor({ data}) {
  const [setContainer] = useRete(data);
  return (
    <>
      <div
        style={{
          backgroundColor: "rgb(242,245,247)",
          width: "100vw",
          height: "80vh",
        }}
        ref={(ref) => ref && setContainer(ref)}
      ></div>
    </>
  );
}

function FLow(props) {
  const [newnode, setnewnode] = useState(null);
  return {
    render: function () {
      return <Editor data={props} />;
    },
    position:{
      setPosition:function(x,y,zoom){
        console.log("setposition called",x,y,zoom);
        publish("setPosition",{x,y,zoom});
      },
      getPosition:  function(){
        
        let x,y,zoom;
        publish("getPosition");
        
        // subscribe("catchPosition",({detail})=>{
        //   x=detail.x;
        //   y=detail.y;
        //   zoom=detail.zoom;
        //   console.log("this is inside of catchPosition==>",detail);
        // })
        // return {x,y,zoom};
      },
      reset:function(){
        publish("positionReset");
      }
    },
    nodes: {
      add: function (node) {
        publish("add node",node);
      },
      remove:function (nodeId){
        publish("delete node",nodeId);
      }
    },
    on: function (eventName, listener) {
      document.addEventListener(eventName, listener);
    },
  };
}

export default FLow;
