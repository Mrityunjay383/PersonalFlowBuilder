import {  useState } from "react";
import React from "react";
import FlowBuilder from "./FlowBuilder";
// import "./App.css"
export default function Sample1() {

  let defaultOptions = {
    nodes: {
      foo: {
        nodeId: "foo",
        title: "node 1 ", // this is node heading
        options: {},
        meta: {
          // any data you need to render this node. Should be as minimal as possible and all optional.
          // if e.g. x & y are not present, your component must count it's position and set this meta data to node
          x: 100,
          y: 300,
        },
        parentNodeId: "",
      },
      bar: {
        nodeId: "bar",
        title: "node 2",
        meta: {
          // any data you need to render this node. Should be as minimal as possible and all optional.
          // if e.g. x & y are not present, your component must count it's position and set this meta data to node
          x: 500,
          y: 100,
        },
        options: {},
        parentNodeId: "foo",
      },
      baz: {
        nodeId: "baz",
        title: "node 3 ",
        meta: {
          // any data you need to render this node. Should be as minimal as possible and all optional.
          // if e.g. x & y are not present, your component must count it's position and set this meta data to node
          x: 700,
          y: 500,
        },
        options: {},
        parentNodeId: "foo",
      },
    },
  
  };

  const [options, setOptions] = useState(defaultOptions);
  
  const handleclick = () => {
    setOptions((curr) => {
      return {
        nodes: {
          ...curr.nodes,
          basz: {
            nodeId: "basz",
            title: "node 4 ",
            meta: {
              // any data you need to render this node. Should be as minimal as possible and all optional.
              // if e.g. x & y are not present, your component must count it's position and set this meta data to node
              x: 300,
              y: 300,
            },
            options: {},
            parentNodeId: "foo",
          },
        },
      };
    });
  };

  return (
    <>
      <button type="button" onClick={handleclick}>
        to add node 
      </button>
      <div style={{ width: 1500, height: 900, background: "#FAFAFA" }}>
        <FlowBuilder
          theme={{
            whitespaceAroundNode: 75,
            arrow: {
              fill: "green",
              stroke: "none",
              strokeWidth: "3px",
            },
          }}
          rendernodes={(nodeId) => {
            return (<div><button type="button">{nodeId}</button></div>)
          }}
          options={options}
        />
      </div>
    </>
  );
}
