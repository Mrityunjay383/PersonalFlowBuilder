import React, { useState } from "react";
import { publish } from "./events.js";
import { useRete } from "./rete.js";

function Editor({ data, newnode }) {
  console.log("this is new node data--->", newnode);
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
    hello: function () {
      console.log("hello");
    },
    render: function () {
      return <Editor data={props} />;
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
