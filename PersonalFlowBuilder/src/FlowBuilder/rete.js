import React, {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import Rete, { Input } from "rete";
import AreaPlugin from "rete-area-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import ReactRenderPlugin from "rete-react-render-plugin";
import {controller, publish, publishNode, publishTest, subscribe} from "./events";
import {Action} from "./nodes/Node";
import {MyNode} from "./nodes/Start";
import { conversion, convNode } from "./utils/conversion";

var numSocket = new Rete.Socket("Number value");
const anyTypeSocket = new Rete.Socket("Any type");
numSocket.combineWith(anyTypeSocket);

// Nodes components class
class NumControl extends Rete.Control {

  static componentw = () => (
    <h1>ddddd</h1>
  );

  constructor(emitter, component,key, node, readonly = false) {

    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component =component
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

  // setValue(val) {
  //   this.props.value = val;
  //   this.putData(this.key, val);
  //   this.update();
  // }
};

class NumComponent extends Rete.Component {
  constructor(name) {
    super(name);
    this.data.component = Action;
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var out = new Rete.Output("num", "Next Step", numSocket);
    const component=()=>(
      <h6>this is control of action  </h6>
    );
    return node
      .addInput(inp1)
      .addControl(new NumControl(this.editor,component, "preview", node, true))
      .addOutput(out);
  }
}

class AddComponent extends Rete.Component {
  constructor(name) {
    super(name);
    this.data.component = MyNode; // optional
  }
  
  builder(node) {
    const component=()=>(
      <h6>this is control of start  </h6>
    );
    var out = new Rete.Output("num", "The First Step", numSocket);
    return node
      .addControl(new NumControl(this.editor,component, "preview", node, true))
      .addOutput(out);
  }
}

let id_no = 1;

function incId(id_no) {
  id_no++;
}

// mainn function for all  functionalities of Module
export async function createEditor(container, DATA) {
  let OPTIONS=DATA.options;
  let nodes = DATA.options.nodes;
  var components = new AddComponent("start");
  var components2 = new NumComponent("node");
  var editor = new Rete.NodeEditor("Flow@0.1.0", container);


  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, {createRoot});


  editor.use(ConnectionPathPlugin, {
    options: {vertical: false, curvature: 0.4},
    arrow: {
      color: DATA.theme.arrow.fill,
      marker: "M-5,-10 L-5,10 L30,0 z",
    },
  });

  // event called by method of renderArrow
  subscribe("renderArrow", ({fromNodeId,toNodeId,data}) => {
    let connections = editor.view.connections;

    connections.forEach((connection) => {
      let toNodeId, fromNodeId;
      toNodeId = connection.connection.input.node.id;
      fromNodeId = connection.connection.output.node.id;
      let v;

      if (fromNodeId === fromNodeId && toNodeId === toNodeId) {
        v = data;

        let {fill, stroke, strokeWidth} = v;

        connection.el.getElementsByClassName("main-path")[0].setAttribute(
          "style",
          `stroke:${fill} !important;fill:${stroke} !important;
        stroke-width:${strokeWidth} !important; `,
        );
        connection.el
          .getElementsByClassName("marker")[0]
          .setAttribute("style", ` fill:${fill} !important;`);
      }
    });
  });

   const edi=editor
  editor.on("rendernode",({ el, node, component, bindSocket, bindControl })=>{
  let  spcomponent;
  
 
//  let con=node.inputs.get("num1");
 
// if(con==undefined){
//   nnode.parentNodeId="";
// }
// else{
//   nnode.parentNodeId=con.connections
// }
//  console.log("node---",nnode,node);
 spcomponent=()=>( 
      DATA.rendernodes({node:convNode(node),options:conversion(editor.nodes)})
      ); 
 
  node.controls.set("preview",new NumControl(edi,spcomponent, "preview", node, true) )
  
});

  editor.on("renderconnection", ({el, connection, points}) => {
    let fromNodeId, toNodeId;
    toNodeId = connection.input.node.id;
    fromNodeId = connection.output.node.id;

    let v;
    // if(fromNodeId==="node-1" && toNodeId==="node-2"){
    //   v=DATA.renderArrow({fromNodeId,toNodeId});
    // }

    if (v) {
      let {fill, stroke, strokeWidth} = v;
      el.getElementsByClassName("main-path")[0].setAttribute(
        "style",
        `stroke:${fill} !important;fill:${stroke} !important;
        stroke-width:${strokeWidth} !important; `,
      );
    } else {
      el.getElementsByClassName("main-path")[0].setAttribute(
        "style",
        `stroke:${DATA.theme.arrow.fill} !important;fill:${DATA.theme.arrow.stroke} !important;
      stroke-width:${DATA.theme.arrow.strokeWidth} !important; `,
      );
    }
  });

  
  editor.use(AutoArrangePlugin, {margin: {x: 50, y: 50}, depth: 100});
  let obj = document.querySelectorAll("path");
  //  obj.style.stroke=DATA.theme.fill;
  var engine = new Rete.Engine("Flow@0.1.0");

  editor.register(components);
  editor.register(components2);
let doarrange;
  for(let node in nodes) {
    let createNode;
    if (nodes[node].parentNodeId === "") {
      createNode = await components.createNode();
    } else {
      createNode = await components2.createNode();
    }
  
    doarrange=1;
    if( nodes[node].meta.x && nodes[node].meta.y){
    createNode.position = [nodes[node].meta.x, nodes[node].meta.y];
    doarrange=0;
  }
  else{
    createNode.position=[100,100];
  }
  

    let editorData = editor.toJSON();
    editorData.nodes[id_no]=createNode;
    editorData.nodes[id_no].id = nodes[node].nodeId;
    editorData.nodes[id_no].data.preview=nodes[node].title;
    incId(id_no);
    await editor.fromJSON(editorData);
    await engine.abort();
    await engine.process(editor.toJSON());
   
  }
  if(doarrange){
     await editor.trigger("arrange", {node: editor.nodes[0]});
  }

  // making custom connections passed by options object in Flowmanager

  for(let node in nodes) {
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
    "process connectioncreated connectionremoved",
    async () => {
      await engine.abort();

      await engine.process(editor.toJSON());
    },
  );
  editor.on("translate", (data) => {
    const ndata={options:{position:{x:data.x,y:data.y,zoom:data.transform.k,}}};
    publish("position.changed", ndata);
  });
  let run = 0;
  editor.on("nodetranslate", (data) => {
    if (run === 0) {
      publish("node.drag.start", {node:convNode(data.node),event:{type:"dragstart"},options:conversion(editor.nodes)});
      run++;
    } else {
      publish("node.position_changed", {node:convNode(data.node),event:data,options:conversion(editor.nodes)});
    }
  });
  
  editor.on("nodedraged", (data) => {
  if(run!==0){
    publish("node.drag.end", {node:convNode(data),event:{type:"dragend"},options:conversion(editor.nodes)});

  }
      });
  editor.on("selectnode", (data) => {
    let ndata={event:data.e,node:convNode(data.node),options:conversion(editor.nodes)};//OPTIONS which we have from users 
    publish("node.click", ndata); // call node.click
    
  });
  // when window gets loaded
  window.addEventListener("load", (d) => {
    const ndata={options:conversion(editor.nodes)};
    publish("loaded", ndata);
  });

  ///customisation event driven programming =======.......

  // event of add node
  subscribe("add node", async ({nodeId,title,parentNodeId }) => {
    let flag=1;
    editor.nodes.forEach((n)=>{
      if(n.id===nodeId){
        flag=0;
      }
    });
    if(flag){
      var newnode = await components2.createNode();
      newnode.position = [100, 0];
      newnode.data.preview=title;
      newnode.id=nodeId;

      editor.addNode(newnode);
      let editorD = editor.toJSON();
      await editor.fromJSON(editorD);
      await engine.abort();
      await engine.process(editor.toJSON());
      let editorData = editor.toJSON();
      if (parentNodeId != "") {
        const nid = nodeId;
        const pid = parentNodeId;
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
  
      // ===========
      const nd={node:convNode(editorD.nodes[nodeId]),options:conversion(editor.nodes)};
      await publish("node.added", nd ); // publishing for subscribed event node.added
      //=============
      await editor.trigger("arrange", {node: editor.nodes[0]});
      await publish("positionReset");
    }
    
  });
  // event to remove node BFS traversal
  subscribe("delete node", async ({nodeId}) => {
    let editorData = editor.toJSON();
    let todeletNode = editorData.nodes[nodeId];
    let queue = [];
    queue.push(nodeId);
    let pnode = editorData.nodes[nodeId].inputs.num1.connections;
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

    pconnections = pconnections.filter((c) => c.node != nodeId);

    pconnections.forEach((c) => {
      // maybe will try by checking if need is there to push or duplicacy is present
      editorData.nodes[c.node].inputs.num1.connections.push({
        node: pid,
        output: "num",
        data: {},
      });
    });
    editorData.nodes[pid].outputs.num.connections = pconnections;
  // ===========
  await editor.fromJSON(editorData);
    await engine.abort();
    await engine.process(editor.toJSON());
  console.log("00----",editor.nodes)
    await publish("node.removed", {node:convNode(todeletNode),options:conversion(editor.nodes)}); // publishing for subscribed event node.removed
    //=============
   
  
  });

  // to setPosition of canva
  subscribe("setPosition", async ({x,y,zoom}) => {
    
    
    
    const {area} = editor.view;
    area.transform.x = x;
    area.transform.y = y;
    area.transform.k = zoom;
    area.update();
  });
  let posx, posy, zoom;
  let flag = 0;
  subscribe("getPosition", async () => {
    const {area} = editor.view;
    posx = area.transform.x;
    posy = area.transform.y;
    zoom = area.transform.k;
    publish("catchPosition", {x1: posx, y1: posy, zoom1:zoom});
    //  if(1){
    //   await
    //  }
  });

  subscribe("positionReset", () => {
    const {area} = editor.view;
    AreaPlugin.zoomAt(editor, editor.nodes);

    // area.transform.x=area.container.;
    // area.transform.y=area.container.;
    area.transform.k = 1;
    area.update();
  });
  subscribe("nodesPositionReset", () => {
    editor.trigger("arrange", {node: editor.nodes[0]});
  });
  
  subscribe("resetEverything", async () => {
    let data = editor.toJSON();
    data.nodes = {};
    await editor.fromJSON(data);
    await engine.abort();
    await engine.process(editor.toJSON());
    for(let node in nodes) {
      let createNode;
      if (nodes[node].parentNodeId === "") {
        createNode = await components.createNode();
      } else {
        createNode = await components2.createNode();
      }
     doarrange=1;
      if( nodes[node].meta.x && nodes[node].meta.y){
      createNode.position = [nodes[node].meta.x, nodes[node].meta.y];
      doarrange=0;
    }
      // editor.addNode(createNode);
  
  
      let editorData = editor.toJSON();
      editorData.nodes[id_no]=createNode;
      editorData.nodes[id_no].id = nodes[node].nodeId;
      editorData.nodes[id_no].data.preview=nodes[node].title;
      incId(id_no);
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

    for(let node in nodes) {
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
        await editor.trigger("arrange", {node: editor.nodes[0]});
      }
    }
  });

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);

  return editor;
}

export function useRete(DATA) {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container, DATA).then((value) => {
        editorRef.current = value;
      });

    }
    // controller.abort();
  }, [container]);
  
  useEffect(() => {
  let editorData=editorRef.current;
      for( let option in DATA.options.nodes){
        publishNode("add node",DATA.options.nodes[option]); 
      }
    // for (const eventType of Object.keys(getEventListeners(document))) {
    //   getEventListeners(document)[eventType].forEach((o) => {
    //     o.remove();
    //   });
    // }
  // editorData.nodes.forEach((node)=>{
  // })
  }, [DATA.options.nodes]);
  
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return [setContainer];
}
