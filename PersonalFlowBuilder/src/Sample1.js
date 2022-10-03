import {  useState } from "react";
// import React from "react";
// import FlowBuilder from "./FlowBuilder";
// // import "./App.css"
// export default function Sample1() {

//   let defaultOptions = {
//     nodes: {
//       foo: {
//         nodeId: "foo",
//         title: "node 1 ", // this is node heading
//         options: {},
//         meta: {
//           // any data you need to render this node. Should be as minimal as possible and all optional.
//           // if e.g. x & y are not present, your component must count it's position and set this meta data to node
//           x: 100,
//           y: 300,
//         },
//         parentNodeId: "",
//       },
//       bar: {
//         nodeId: "bar",
//         title: "node 2",
//         meta: {
//           // any data you need to render this node. Should be as minimal as possible and all optional.
//           // if e.g. x & y are not present, your component must count it's position and set this meta data to node
//           x: 500,
//           y: 100,
//         },
//         options: {},
//         parentNodeId: "foo",
//       },
//       baz: {
//         nodeId: "baz",
//         title: "node 3 ",
//         meta: {
//           // any data you need to render this node. Should be as minimal as possible and all optional.
//           // if e.g. x & y are not present, your component must count it's position and set this meta data to node
//           x: 700,
//           y: 500,
//         },
//         options: {},
//         parentNodeId: "foo",
//       },
//     },
  
//   };

//   const [options, setOptions] = useState(defaultOptions);
  
//   const handleclick = () => {
//     setOptions((curr) => {
//       return {
//         nodes: {
//           ...curr.nodes,
//           basz: {
//             nodeId: "basz",
//             title: "node 4 ",
//             meta: {
//               // any data you need to render this node. Should be as minimal as possible and all optional.
//               // if e.g. x & y are not present, your component must count it's position and set this meta data to node
//               x: 300,
//               y: 300,
//             },
//             options: {},
//             parentNodeId: "foo",
//           },
//         },
//       };
//     });
//   };

//   return (
//     <>
//       <button type="button" onClick={handleclick}>
//         to add node 
//       </button>
//       <div style={{ width: 1500, height: 900, background: "#FAFAFA" }}>
//         <FlowBuilder
//           theme={{
//             whitespaceAroundNode: 75,
//             arrow: {
//               fill: "green",
//               stroke: "none",
//               strokeWidth: "3px",
//             },
//           }}
//           rendernodes={(nodeId) => {
//             return (<div><h2>hellpppppp</h2>
//             <button type="button">{nodeId}</button></div>)
//           }}
//           options={options}
//         />
//       </div>
//     </>
//   );
// }


import React from "react";
import {useRef} from "react";
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

  const [options, setOptions] = useState(defaultOptions);

  let flowRef = useRef(null);
  let flowManager = null;
  if (flowRef.current) {
    flowManager = flowRef.current;
  }
  if(flowManager){
    flowManager.on("node.click", ({detail}) => {
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
    flowManager.on("node.added", ({detail}) => {
      console.log("nodes is added====>", detail);
    });
    flowManager.on("node.removed", ({detail}) => {
      console.log("node is removed===>", detail);
    });
    flowManager.on("loaded", ({detail}) => {
      console.log("====================================");
      console.log("document is fully loaded ", detail);
      console.log("====================================");
    });
    flowManager.on("position.changed", ({detail}) => {
      console.log("canvas position is changed", detail);
    });
    flowManager.on("node.mouse.over", ({detail}) => {
      console.log("mouse over");
    });
    flowManager.on("node.mouse.out", ({detail}) => {
      console.log("mouse out");
    });
    flowManager.on("node.mouse.down", ({detail}) => {
      console.log("mouse down");
    });
    flowManager.on("node.mouse.up", ({detail}) => {
      console.log("mouse up");
    });
    flowManager.on("node.position_changed", ({detail}) => {
      console.log("node position changed-->", detail);
    });
    flowManager.on("node.drag.start", ({detail}) => {
      console.log("node drag start", detail);
    });
    flowManager.on("node.drag.end", ({detail}) => {
      console.log("node drag end", detail);
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
        <button type="button" onClick={() => {
          if (flowManager?.position?.get) {
            console.log(`#202227610493933 flowManager?.position?.get: `, flowManager?.position?.get());
          } else {
            console.error(`#2022276104945451 flowManager?.position?.get is not available`);
          }
        }}>
          get current position
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
      </div>
      <div style={{width: 900, height: 600, background: "#D4FAB6"}}>
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
          rendernodes={(node,nodeId,nodeTitle) => {
            return (<div style={{border:"1px solid"}}>
                <h1 >{nodeTitle}</h1> 
              <button type="button">{nodeId}</button>
            </div>);
          }}
          
        />
      </div>
    </>
  );
}