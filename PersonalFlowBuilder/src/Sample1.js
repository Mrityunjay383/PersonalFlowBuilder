import { useState,useEffect} from "react";
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
    nodeId: `baz${Date.now()}`,
    title: "new added node ",
    type: "email",
    options: {},
    parentNodeId: `baz`,
    meta: {
      // any data you need to render this node. Should be as minimal as possible and all optional.
      // if e.g. x & y are not present, your component must count it's position and set this meta data to node
      x: 100,
      y: 700,
    },
  };

  const [options, setOptions] = useState(defaultOptions);

  let flowRef = useRef(new FlowBuilder());
  let flowManager = null;
console.log("===",);
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
        console.log("document is fully loaded ", options); // options is the state all the nodes 
        console.log("====================================");
      });
      flowManager.on("node.mouse.over", ({ event, node,options }) => {
        console.log("mouse over--->", event, node,options );
      });
      flowManager.on("node.mouse.out", ({ event, node,options  }) => {
        console.log("mouse out", event, node,options );
      });
      
      flowManager.on("position.changed", ({ options }) => {
        console.log("canvas position is changed", options); // here options is the object with position property.x /y/zoom
      });
    
      flowManager.on("node.mouse.down", ({ event, node,options  }) => {
        console.log("mouse down", event, node,options );
      });
      flowManager.on("node.mouse.up", ({ event, node ,options }) => {
        console.log("mouse up", event, node,options );
      });
      flowManager.on("node.position_changed", ({ event, node, options }) => {
        console.log("node position changed-->", node, options);
      });
      flowManager.on("node.drag.start", ({ event, node, options }) => {
        console.log("node drag start",node, options);
      });
      flowManager.on("node.drag.end", ({ event, node, options }) => {
        console.log("node drag end", node, options);
      });
    }
    

  console.log(`#202227610501820 flowManager`, flowManager);



  return (
    <>
      <div>
      
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
          nodes position reset 
        </button>
        <button
          type="button"
          onClick={() => {
            flowManager.nodes.add({node:{
              nodeId: `baz${Date.now()}`,
              title: "new added node ",
              type: "email",
              options: {},
              parentNodeId: `baz`,
              meta: {
                // any data you need to render this node. Should be as minimal as possible and all optional.
                // if e.g. x & y are not present, your component must count it's position and set this meta data to node
                x: 100,
                y: 700,
              },
            }});
          }}
        >
          adding node by method
        </button>
        <button
          type="button"
          onClick={() => {
            flowManager.nodes.remove({nodeId:"baz"});
          }}
        >
          removing node method
        </button>
        <button
          type="button"
          onClick={() => {
            flowManager.reset();
          }}
        >
         Reset 
        </button>
      </div>
      <div style={{ width: "100vw", height: "100vh", background: "#D4FAB6" }}>
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
          rendernodes={({node,options}) => {
            return (
              <div style={{ border: "1px solid" }}>
                <h1>{node.title}</h1>
                <button type="button">{node.nodeId}</button>
              </div>
            );
          }}
        />
      </div>
    </>
  );
}
