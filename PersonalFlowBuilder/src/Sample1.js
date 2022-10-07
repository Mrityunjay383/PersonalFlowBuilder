import { useState } from "react";
import React from "react";
import { useRef } from "react";
import FlowBuilder from "./FlowBuilder";

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
  let node1 = {
    nodeId: "node-5",
    title: "new added node ",
    type: "email",
    options: {},
    parentNodeId: "foo",

    meta: {
      // any data you need to render this node. Should be as minimal as possible and all optional.
      // if e.g. x & y are not present, your component must count it's position and set this meta data to node
      x: 100,
      y: 700,
    },
  };

  const [options, setOptions] = useState(defaultOptions);

  let flowRef = useRef(null);
  let flowManager = null;
  if (flowRef.current) {
    flowManager = flowRef.current;
  }
  if (flowManager) {
    flowManager.on("node.click", ({ event, node, options }) => {
      console.log("====================================");
      console.log("node.click is triggered on", {
        event: event,
        node: node,
        options: options,
      });
      console.log(
        "====== event.width ==============================",
        event.width
      );
    });
    flowManager.on("node.added", ({ node, options }) => {
      console.log("nodes is added====>", node, options);
    });
    flowManager.on("node.removed", ({ node, options }) => {
      console.log("node is removed===>", node, options);
    });
    flowManager.on("loaded", ({ options }) => {
      console.log("====================================");
      console.log("document is fully loaded ", options);
      console.log("====================================");
    });
    flowManager.on("position.changed", ({ options }) => {
      console.log("canvas position is changed", options);
    });
    flowManager.on("node.mouse.over", ({ event, node }) => {
      console.log("mouse over--->", event, node);
    });
    flowManager.on("node.mouse.out", ({ event, node }) => {
      console.log("mouse out", event, node);
    });
    flowManager.on("node.mouse.down", ({ event, node }) => {
      console.log("mouse down", event, node);
    });
    flowManager.on("node.mouse.up", ({ event, node }) => {
      console.log("mouse up", event, node);
    });
    flowManager.on("node.position_changed", ({ event, node, options }) => {
      console.log("node position changed-->", event, node, options);
    });
    flowManager.on("node.drag.start", ({ event, node, options }) => {
      console.log("node drag start", event, node, options);
    });
    flowManager.on("node.drag.end", ({ event, node, options }) => {
      console.log("node drag end", event, node, options);
    });
  }

  console.log(`#202227610501820 flowManager`, flowManager);

  const handleclick = () => {
    setOptions((curr) => {
      return {
        nodes: {
          ...curr.nodes,
          basz: {
            nodeId: `basz-${Date.now()}`,
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
      <div>
        <button type="button" onClick={handleclick}>
          to add node
        </button>
        <button
          type="button"
          onClick={() => {
            if (flowManager?.position?.get) {
              console.log(
                `#202227610493933 flowManager?.position?.get: `,
                flowManager?.position?.get()
              );
            } else {
              console.error(
                `#2022276104945451 flowManager?.position?.get is not available`
              );
            }
          }}
        >
          get current position
        </button>
        <button
          type="button"
          onClick={() => {
            flowManager.position.setPosition({ x: 100, y: 100, zoom: 2 }); // x, y, zoom
          }}
        >
          setPosition
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
            flowManager.nodes.add({node1});
          }}
        >
          adding node method
        </button>
        <button
          type="button"
          onClick={() => {
            flowManager.nodes.remove({nodeId:"node-3"});
          }}
        >
          removing node method
        </button>
      </div>
      <div style={{ width: 900, height: 600, background: "#D4FAB6" }}>
        <FlowBuilder
     
     ref={flowRef}
          theme={{
            whitespaceAroundNode: 35,
            arrow: {
              fill: "black",
              stroke: "none",
              strokeWidth: "3px",
            },
          }}
          options={options}
          rendernodes={(node, nodeId, nodeTitle) => {
            return (
              <div style={{ border: "1px solid" }}>
                <h1>{nodeTitle}</h1>
                <button type="button">{nodeId}</button>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
