import React, { useState, useRef } from "react";

import "./App.css";
import { publish, subscribe } from "./FlowBuilder/events";

import FLow from "./FlowBuilder/Flow";

function App() {
  let flowRef = useRef(FLow());
  let flowManager = flowRef.current;
  // Events customised

  flowManager.on("node.click", ({ detail }) => {
    let event, node, options;
    event = detail.e; // pointer event
    node = detail.node; // value of node which is selected
    options = detail.accumulate; // boolean value
    console.log("====================================");
    console.log("node.click is triggered on", {
      event: event,
      node: node,
      options: options,
    });
    console.log("====================================");
  });
  flowManager.on("node.added", ({ detail }) => {
    console.log("nodes is addeed====>", detail);
  });
  flowManager.on("node.removed", ({ detail }) => {
    console.log("node is removed===>", detail);
  });
  flowManager.on("loaded", ({ detail }) => {
    console.log("====================================");
    console.log("document is fully loaded ", detail);
    console.log("====================================");
  });
  flowManager.on("position.changed", ({ detail }) => {
    console.log("canvas position is changed", detail);
  });
  flowManager.on("node.mouse.over", ({ detail }) => {
    console.log("mouse over");
  });
  flowManager.on("node.mouse.out", ({ detail }) => {
    console.log("mouse out");
  });
  flowManager.on("node.mouse.down", ({ detail }) => {
    console.log("mouse down");
  });
  flowManager.on("node.mouse.up", ({ detail }) => {
    console.log("mouse up");
  });
  flowManager.on("node.position_changed", ({ detail }) => {
    console.log("node position changed-->", detail);
  });
  flowManager.on("node.drag.start", ({ detail }) => {
    console.log("node drag start", detail);
  });
  flowManager.on("node.drag.end", ({ detail }) => {
    console.log("node drag end", detail);
  });
  const node1 = {
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
        onClick={async () => {
          flowManager.nodes.add(node1);
        }}
      >
        add node
      </button>
      <button
        type="button"
        onClick={() => {
          flowManager.nodes.remove("node-3");
        }}
      >
        delete node
      </button>
      <button
        type="button"
        onClick={() => {
          flowManager.position.setPosition(100, 100, 2); // x, y, zoom
        }}
      >
        setPosition
      </button>
      <button
        type="button"
        onClick={async () => {
          let d = await flowManager.position.getPosition(); // return  x, y, zoom
          console.log("here u go --->", d);
        }}
      >
        getPosition
      </button>
      <button
        type="button"
        onClick={async () => {
          flowManager.position.reset();
        }}
      >
        position Reset
      </button>
      <button
        type="button"
        onClick={() => {
          flowManager.nodes.reset();
        }}
      >
        auto arrange
      </button>
      <button
        type="button"
        onClick={() => {
          flowManager.reset(); // reload the page
        }}
      >
        Reset
      </button>
      <button
        type="button"
        onClick={() => {
          flowManager.renderArrow("node-1", "node-2", {
            fill: "red",
            stroke: "none",
            strokeWidth: "2px",
          }); // reload the page
        }}
      >
        renderArrow
      </button>
      <FLow
        theme={{
          whitespaceAroundNode: 75,
          arrow: {
            fill: "green",
            stroke: "none",
            strokeWidth: "3px",
          },
        }}
        // renderArrow={({ fromNodeId, toNodeId }) => {
        //   return {
        //     fill: "red",
        //     stroke: "none",
        //     strokeWidth: "2px",
        //   };
        // }}
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
