import {useState} from "react";
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
          rendernodes={(nodeId) => {
            return (<div>
              <button type="button">{nodeId}</button>
            </div>);
          }}
          options={options}
        />
      </div>
    </>
  );
}
