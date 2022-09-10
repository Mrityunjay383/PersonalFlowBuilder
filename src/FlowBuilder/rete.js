import React, { useState, useEffect, useRef } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import AreaPlugin from "rete-area-plugin";
import Context from "efficy-rete-context-menu-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";
import ContextMenuPlugin, {
  Menu,
  Item,
  Search,
} from "rete-context-menu-plugin";
import { MyNode } from "./Start";
import { Action } from "./Node";

import { publish, subscribe, subscribeDReturn } from "./events";
var numSocket = new Rete.Socket("Number value");
const anyTypeSocket = new Rete.Socket("Any type");
numSocket.combineWith(anyTypeSocket);

// Nodes components class
class NumControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="button"
      value="Add Template"
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onClick={(e) => {
        onChange(value + 1);
      }}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = NumControl.component;
    const initial = node.data[key] || 0;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class NumComponent extends Rete.Component {
  constructor(name) {
    super(name);
    this.data.component = Action;
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var out = new Rete.Output("num", "Next Step", numSocket);
    return node
      .addInput(inp1)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }
}

class AddComponent extends Rete.Component {
  constructor(name) {
    super(name);
    this.data.noContextMenu = true;
    this.data.component = MyNode; // optional
  }

  builder(node) {
    var out = new Rete.Output("num", "The First Step", numSocket);
    return node
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }
}
let id_no = 1;
function incId(id_no) {
  id_no++;
}

// mainn function for all  functionalities of Module
export async function createEditor(container, data) {
  let nodes = data.options.nodes;
  var components = new AddComponent("start");
  var components2 = new NumComponent("node");

  var editor = new Rete.NodeEditor("Flow@0.1.0", container);

  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { createRoot });

  editor.use(ContextMenuPlugin, {
    searchBar: false, // true by default
    rename(component) {
      if (component.name != "Start") {
        return `+${component.name}`;
      }
    },
  });
  editor.use(ConnectionPathPlugin, {
    options: { vertical: false, curvature: 0.4 },
    arrow: {
      color: data.theme.arrow.fill,
      marker: "M-5,-10 L-5,10 L20,0 z",
    },
  });

  // event called by method of renderArrow
  subscribe("renderArrow", ({ detail }) => {
    let connections = editor.view.connections;

    connections.forEach((connection) => {
      let toNodeId, fromNodeId;
      toNodeId = connection.connection.input.node.id;
      fromNodeId = connection.connection.output.node.id;
      let v;

      if (fromNodeId == detail.fromNodeId && toNodeId == detail.toNodeId) {
        v = detail.data;

        let { fill, stroke, strokeWidth } = v;

        connection.el.getElementsByClassName("main-path")[0].setAttribute(
          "style",
          `stroke:${fill} !important;fill:${stroke} !important;
        stroke-width:${strokeWidth} !important; `
        );
        connection.el
          .getElementsByClassName("marker")[0]
          .setAttribute("style", ` fill:${fill} !important;`);
      }
    });
  });

  editor.on("renderconnection", ({ el, connection, points }) => {
    let fromNodeId, toNodeId;
    toNodeId = connection.input.node.id;
    fromNodeId = connection.output.node.id;

    let v;
    // if(fromNodeId=="node-1" && toNodeId=="node-2"){
    //   v=data.renderArrow({fromNodeId,toNodeId});
    // }

    if (v) {
      let { fill, stroke, strokeWidth } = v;
      el.getElementsByClassName("main-path")[0].setAttribute(
        "style",
        `stroke:${fill} !important;fill:${stroke} !important;
        stroke-width:${strokeWidth} !important; `
      );
    } else {
      el.getElementsByClassName("main-path")[0].setAttribute(
        "style",
        `stroke:${data.theme.arrow.fill} !important;fill:${data.theme.arrow.stroke} !important;
      stroke-width:${data.theme.arrow.strokeWidth} !important; `
      );
    }
  });

  editor.use(AutoArrangePlugin, { margin: { x: 50, y: 50 }, depth: 100 });
  let obj = document.querySelectorAll("path");
  //  obj.style.stroke=data.theme.fill;
  var engine = new Rete.Engine("Flow@0.1.0");

  editor.register(components);
  editor.register(components2);

  for (let node in nodes) {
    let createNode;
    if (nodes[node].parentNodeId == "") {
      createNode = await components.createNode();
    } else {
      createNode = await components2.createNode();
    }

    createNode.position = [nodes[node].meta.x, nodes[node].meta.y];
    editor.addNode(createNode);
    let editorData = editor.toJSON();
    editorData.nodes[id_no].id = nodes[node].nodeId;
    incId(id_no);
    await editor.fromJSON(editorData);
    await engine.abort();
    await engine.process(editor.toJSON());
  }

  // making custom connections passed by options object in Flowmanager

  for (let node in nodes) {
    if (nodes[node].parentNodeId != "") {
      let editorData = editor.toJSON();
      const nid = nodes[node].nodeId;
      const pid = nodes[node].parentNodeId;

      editorData.nodes[nid].inputs.num1.connections.push({
        node: pid,
        output: "num",
        data: {},
      });
      editorData.nodes[pid].outputs.num.connections.push({
        node: nid,
        input: "num1",
        data: {},
      });

      await editor.fromJSON(editorData);
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  }

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      await engine.abort();

      await engine.process(editor.toJSON());
    }
  );

  editor.on("translate", (data) => {
    publish("position.changed", data);
  });
  let run = 0;
  editor.on("nodetranslate", (data) => {
    if (run == 0) {
      publish("node.drag.start", data);
      run++;
    } else {
      publish("node.position_changed", data);
    }
  });
  editor.on("nodedraged", (data) => {
    run = 0;
    publish("node.drag.end", data);
  });
  editor.on("selectnode", (data) => {
    publish("node.click", data); // call node.click
  });
  // when window gets loaded
  window.addEventListener("load", (d) => {
    publish("loaded", d);
  });

  ///customisation event driven programming =====.......

  // event of add node
  subscribe("add node", async ({ detail }) => {
    var newnode = await components2.createNode();
    newnode.position = [100, 0];
    editor.addNode(newnode);
    let editorD = editor.toJSON();

    editorD.nodes[1].id = detail.nodeId;
    await editor.fromJSON(editorD);
    await engine.abort();
    await engine.process(editor.toJSON());
    let editorData = editor.toJSON();
    if (detail.parentNodeId != "") {
      const nid = detail.nodeId;
      const pid = detail.parentNodeId;
      editorData.nodes[nid].inputs.num1.connections.push({
        node: pid,
        output: "num",
        data: {},
      });
      editorData.nodes[pid].outputs.num.connections.push({
        node: nid,
        input: "num1",
        data: {},
      });
    }

    await editor.fromJSON(editorData);
    await engine.abort();
    await engine.process(editor.toJSON());

    // ========
    await publish("node.added", editorD.nodes[1]); // publishing for subscribed event node.added
    //==========
    await editor.trigger("arrange", { node: editor.nodes[0] });
    await publish("positionReset");
  });
  // event to remove node BFS traversal
  subscribe("delete node", async ({ detail }) => {
    let editorData = editor.toJSON();
    let todeletNode = editorData.nodes[detail];
    let queue = [];
    queue.push(detail);
    let pnode = editorData.nodes[detail].inputs.num1.connections;
    let pid;
    let pconnections = [];
    if (pnode.length > 0) {
      pid = pnode[0].node;
      pconnections = [
        ...pconnections,
        ...editorData.nodes[pid].outputs.num.connections,
      ];
    }
    while (queue.length > 0) {
      let n = queue[0];
      queue.splice(0, 1);
      let connections = editorData.nodes[n].outputs.num.connections;
      delete editorData.nodes[n];
      connections.forEach((c) => {
        queue.push(c.node);
      });
    }

    pconnections = pconnections.filter((c) => c.node != detail);

    pconnections.forEach((c) => {
      // maybe will try by checking if need is there to push or duplicacy is present
      editorData.nodes[c.node].inputs.num1.connections.push({
        node: pid,
        output: "num",
        data: {},
      });
    });
    editorData.nodes[pid].outputs.num.connections = pconnections;

    // editor.removeNode(todeletNode);
    await editor.fromJSON(editorData);
    await engine.abort();
    await engine.process(editor.toJSON());
    // ========
    publish("node.removed", todeletNode); // publishing for subscribed event node.removed
    //==========
  });

  // to setPosition of canva
  subscribe("setPosition", async ({ detail }) => {
    let x = detail.x;
    let y = detail.y;
    let k = detail.zoom;
    const { area } = editor.view;
    area.transform.x = x;
    area.transform.y = y;
    area.transform.k = k;
    area.update();
  });
  let posx, posy, zoom;
  let flag = 0;
  subscribe("getPosition", async () => {
    const { area } = editor.view;
    posx = area.transform.x;
    posy = area.transform.y;
    zoom = area.transform.k;
    publish("catchPosition", { x: posx, y: posy, zoom });
    //  if(1){
    //   await
    //  }
  });

  subscribe("positionReset", () => {
    const { area } = editor.view;
    AreaPlugin.zoomAt(editor, editor.nodes);

    // area.transform.x=area.container.;
    // area.transform.y=area.container.;
    area.transform.k = 1;
    area.update();
  });
  subscribe("nodesPositionReset", () => {
    editor.trigger("arrange", { node: editor.nodes[0] });
  });
  subscribe("resetEverything", async () => {
    let data = editor.toJSON();
    data.nodes = {};
    await editor.fromJSON(data);
    await engine.abort();
    await engine.process(editor.toJSON());
    for (let node in nodes) {
      let createNode;
      id_no = 1;
      if (nodes[node].parentNodeId == "") {
        createNode = await components.createNode();
      } else {
        createNode = await components2.createNode();
      }

      createNode.position = [nodes[node].meta.x, nodes[node].meta.y];
      createNode.id = nodes[node].nodeId;
      editor.addNode(createNode);
      let editorData = editor.toJSON();

      await editor.fromJSON(editorData);
      await engine.abort();
      await engine.process(editor.toJSON());
    }

    //  // making helper obj for making connections based on custom data
    //  let helperObj={};
    //  let editorData= editor.toJSON();
    //  for (let idNo in editorData.nodes) {
    //   helperObj[idNo]=editorData.nodes[idNo];
    // }
    // making custom connections

    for (let node in nodes) {
      if (nodes[node].parentNodeId != "") {
        let editorData = editor.toJSON();
        const nid = nodes[node].nodeId;
        const pid = nodes[node].parentNodeId;
        // helperObj[pid].outputs.num.connections.push({node:pid,output:'num',data:{}});
        editorData.nodes[nid].inputs.num1.connections.push({
          node: pid,
          output: "num",
          data: {},
        });
        editorData.nodes[pid].outputs.num.connections.push({
          node: nid,
          input: "num1",
          data: {},
        });

        await editor.fromJSON(editorData);
        await engine.abort();
        await engine.process(editor.toJSON());
      }
    }
  });

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);

  return editor;
}

export function useRete(data) {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container, data).then((value) => {
        editorRef.current = value;
      });
    }
  }, [container]);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return [setContainer];
}
