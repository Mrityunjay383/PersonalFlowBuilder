import React, { useState, useRef } from "react";

import "./App.css";
import { publish, subscribe } from "./FlowBuilder/events";

import FLow from "./FlowBuilder/Flow";

function App() {
  let flowRef = useRef(FLow());
  let flowmanager = flowRef.current;

  flowmanager.on("any click", () => {
    console.log("say-hello");
  });

  const node = {
    nodeId: "node-4",
    type: "email",
    options: {},
    parentNodeId: "node-2",
    meta: {
      // any data you need to render this node. Should be as minimal as possible and all optional.
      // if e.g. x & y are not present, your component must count it's position and set this meta data to node
      x: 700,
      y: 100,
    },
  };

  return (
    <div className="App">
      <h1>This is a the flow Component</h1>
      <hr />
      <button
        type="button"
        onClick={() => {
          flowmanager.nodes.add(node);
        }}
      >
        add node
      </button>
      <button
        type="button"
        onClick={() => {
          flowmanager.nodes.remove("node-3");
        }}
      >
        delete node
      </button>
      <FLow
        data="hello"
        options={{
          // all canvas position. If not set - reset to default position so all nodes would be visible.
          position: { x: 1, y: 1, zoom: 1 },
          // nodes
          nodes: {
            // each node has:
            // 1. unique nodeId - any random string [a-Z0-9\-]{1,30}
            // 2. type (any snake_case string)
            // 3. options, which is any needed custom data, e.g. options of the node while "render" may render dropdown or any other form elements inside node.
            // 4. parentNodeId - only root node has no parentNodeId, every other node must always have "path" to root node.
            "node-2": {
              nodeId: "node-2",
              type: "time",
              options: {},
              parentNodeId: "node-1",
              meta: {
                // any data you need to render this node. Should be as minimal as possible and all optional.
                // if e.g. x & y are not present, your component must count it's position and set this meta data to node
                x: 400,
                y: 100,
              },
            },
            "node-1": {
              nodeId: "node-1",
              type: "email",
              options: {},
              parentNodeId: "",
              meta: {
                // any data you need to render this node. Should be as minimal as possible and all optional.
                // if e.g. x & y are not present, your component must count it's position and set this meta data to node
                x: 100,
                y: 100,
              },
            },
            "node-5": {
              nodeId: "node-5",
              type: "time",
              options: {},
              parentNodeId: "node-2",
              meta: {
                // any data you need to render this node. Should be as minimal as possible and all optional.
                // if e.g. x & y are not present, your component must count it's position and set this meta data to node
                x: 600,
                y: 300,
              },
            },
            "node-3": {
              nodeId: "node-3",
              type: "email",
              options: {},
              parentNodeId: "node-2",
              meta: {
                // any data you need to render this node. Should be as minimal as possible and all optional.
                // if e.g. x & y are not present, your component must count it's position and set this meta data to node
                x: 700,
                y: 100,
              },
            },
          },
        }}
      />
    </div>
  );
}

export default App;
