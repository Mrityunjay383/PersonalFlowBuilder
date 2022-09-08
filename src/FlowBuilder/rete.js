import React, { useState, useEffect, useRef } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ConnectionPathPlugin from 'rete-connection-path-plugin';
import AreaPlugin from "rete-area-plugin";
import Context from "efficy-rete-context-menu-plugin";
import ContextMenuPlugin, { Menu, Item, Search } from 'rete-context-menu-plugin';
import { MyNode } from "./MyNode";
import { Action } from "./Action";
import { Condition } from "./condition";
import { extend } from "@vue/shared";
import { SmartDelay } from "./SmartDelay";

import { Selector } from "./selector";
import { publish, subscribe } from "./events";
var numSocket = new Rete.Socket("Number value");
const anyTypeSocket = new Rete.Socket('Any type');
numSocket.combineWith(anyTypeSocket);


class NumControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <input
      type="button"
      value="Add Template"
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onClick={(e) => {
        onChange(value+1)
        console.log(value)
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
      }
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}
class SelectorComponent extends Rete.Component{
  constructor() {
    super( `Selecter`);
    this.data.component =Selector;
  }


  builder(node) {
      var inp1 = new Rete.Input("num1", "Number", numSocket);
    var out = new Rete.Output("num", "Next Step", numSocket);
    {console.log(node)}
    return node
    .addInput(inp1)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }

}


class NumComponent extends Rete.Component {
  constructor(name) {
    super(name);
    this.data.component =Action
  }


  builder(node) {
      var inp1 = new Rete.Input("num1", "Number", numSocket);
    var out = new Rete.Output("num", "Next Step", numSocket);
    return node
    .addInput(inp1)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}
class  SmartDelayComponent extends Rete.Component{
  constructor() {
    super( `Smart Delay`);
    this.data.component =SmartDelay;
  }
  builder(node){
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var out = new Rete.Output("num", "Next Step", numSocket);
    {console.log(node)}
    return node
    .addInput(inp1)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }
  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

class ConditonComponent extends Rete.Component{
  constructor() {
    super( `Condition`);
    this.data.component =Condition;
  }
  builder(node){
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var out = new Rete.Output("num", "Next Step", numSocket);
    {console.log(node)}
    return node
    .addInput(inp1)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }
  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
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

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}
let id_no=1;
function incId(id_no){
  id_no++;
}

export async function createEditor(container,data) {
  console.log("inside the create editor==>",data);
  let nodes=data.options.nodes;
  console.log(nodes);
  var components = new AddComponent("start");
  var components2=new NumComponent("node");
  var conditionComponent=new ConditonComponent();
  var DelayComponent =new SmartDelayComponent();
  var editor = new Rete.NodeEditor("Flow@0.1.0", container);
  const selector=new SelectorComponent();
  editor.use(ConnectionPlugin,);
  editor.use(ReactRenderPlugin, { createRoot } );

  editor.use(ContextMenuPlugin,{
    searchBar: false, // true by default
    rename(component){
      console.log(component);
      if(component.name!="Start"){
        return `+${component.name}`;
      }
    },
    // vueComponent:Selector,

  });
  editor.use(ConnectionPathPlugin, {
    options: { vertical: false, curvature: 0.4 },
    arrow: {
      color: "red",
      marker: 'M-5,-10 L-5,10 L20,0 z'
    }
   });
  var engine = new Rete.Engine("Flow@0.1.0");

  editor.register(components);
  editor.register(components2);
  editor.register(conditionComponent);
  editor.register(DelayComponent);
  editor.register(selector);
  // var add = await components.createNode();
  // // add.position = [500, 240];

  // editor.addNode(add);
  // set up the intial passed nodes  with custom ids
   
  for (let node in nodes) {
    let createNode;
    if(nodes[node].parentNodeId==""){
      createNode= await components.createNode();
    }
    else{
     createNode =await components2.createNode();
    }
   
    createNode.position=[nodes[node].meta.x,nodes[node].meta.y]
    editor.addNode(createNode);
    let editorData= editor.toJSON();
         editorData.nodes[id_no].id=nodes[node].nodeId ;
         incId(id_no);
        await editor.fromJSON(editorData);
        await engine.abort()
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
  if(nodes[node].parentNodeId!=""){
    let editorData=editor.toJSON();
    const nid=nodes[node].nodeId;
    const pid=nodes[node].parentNodeId;
    // helperObj[pid].outputs.num.connections.push({node:pid,output:'num',data:{}});
    editorData.nodes[nid].inputs.num1.connections.push({node:pid,output:'num',data:{}});
    editorData.nodes[pid].outputs.num.connections.push({node:nid,input:'num1',data:{}});

    await editor.fromJSON(editorData);
    await engine.abort()
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
  // editor.on("updateconnection",async( el, connection, points)=>{
  //   console.log(el,connection,points);
  // });
  editor.on("connectioncreate",async(connection)=>{
      console.log("this is connection==>",connection);
  });
  // editor.on("keydown", async(keyEvent)=>{
  //     if(keyEvent.key=="Enter"){
  //       var newnode= await components2.createNode();
  //       newnode.position = [400, 240];
  //       editor.addNode(newnode);

  //       await engine.abort();

  //       await engine.process(editor.toJSON());

  //     }
  // });

  let x,y;
  editor.on("connectionpath", async (data) => {
    // console.log("connectionpath ", data);
    [x, y] = [data.points[2], data.points[3]];
  })
let pointerEvent;
let  view=editor.view;
editor.on("click",async(e)=>{
  publish("any click");
  console.log('====================================');
  console.log(editor.toJSON());
  console.log('====================================');
});
  // editor.on("connectiondrop", async (data1) => {
  //   console.log("connectiondrop ", data1);
  //   var newnode= await components2.createNode();
  //   newnode.position = [x, y];
  //     console.log("newnode -->",newnode);
     
  //     editor.addNode(newnode);
  //    editor.connect(data1,newnode.inputs.get("num1"));

  //   await engine.abort();

  //   await engine.process(editor.toJSON());
  // })

 
  editor.on('contextmenu', ({e,view}) => {
    console.log("mouseEvent of context menu-->" ,e,view);
});
editor.on("zoom",(data)=>{
  console.log('====================================');
  console.log("zooooom",data);
  console.log('====================================');
     });
     editor.on("nodetranslate",(data)=>{
      console.log('====================================');
      console.log("nodetranslate	",data);
      console.log('====================================');
              });
  editor.on("selectnode",(data)=>{
  publish("node.click",data);// call node.click     
         });
        

///customisation event driven programming =====.......


// event of add node 
subscribe("add node",async({detail})=>{
  console.log("data inside the add node-->",detail);
  var newnode= await components2.createNode();
  newnode.position = [100 ,0];
  editor.addNode(newnode);
  let editorD= editor.toJSON();
 editorD.nodes[1].id=detail.nodeId; 
 
  await editor.fromJSON(editorD);  
  await engine.abort()
  await engine.process(editor.toJSON());
  // ========
  publish("node.added",editorD.nodes[1]);// publishing for subscribed event node.added
  //==========
  let editorData=editor.toJSON();
  if(detail.parentNodeId!=""){
    const nid=detail.nodeId;
    const pid=detail.parentNodeId;
    editorData.nodes[nid].inputs.num1.connections.push({node:pid,output:'num',data:{}});
    editorData.nodes[pid].outputs.num.connections.push({node:nid,input:'num1',data:{}});
   }
   await editor.fromJSON(editorData);  
   console.log("after update==>",editor.toJSON());
   await engine.abort()
   await engine.process(editor.toJSON());

})
// event to remove node BFS traversal 
subscribe("delete node",async({detail})=>{
    let editorData=editor.toJSON();
    let todeletNode=editorData.nodes[detail];
    let queue=[];
    queue.push(detail);
    let pnode=editorData.nodes[detail].inputs.num1.connections;
    let pid;
    let pconnections=[];
    if(pnode.length>0){
      pid=pnode[0].node;
      pconnections = [...pconnections,...editorData.nodes[pnode[0].node].outputs.num.connections];
    }
    while(queue.length>0){
      let n=queue[0];
      queue.splice(0,1);
      let connections=editorData.nodes[n].outputs.num.connections;
      delete editorData.nodes[n];
      connections.forEach((c)=>{
        queue.push(c.node);
      })  
    }
      // ========
  publish("node.removed",todeletNode);// publishing for subscribed event node.removed
  //==========
    console.log("parent connection --->",pconnections);
    pconnections=pconnections.filter((c)=> c.node!=detail);
      console.log('====================================');
      console.log("pconnections after filtering the wroong one",pconnections);
      console.log('====================================');
      
      pconnections.forEach((c)=>{
        console.log("after delete -->",c.node);
        // maybe will try by checking if need is there to push or duplicacy is present 
        editorData.nodes[c.node].inputs.num1.connections.push({node:pid,output:'num',data:{}});
        editorData.nodes[pid].outputs.num.connections.push({node:c.node,input:'num1',data:{}});

    })
    console.log("parent connection after update --->",pconnections);

  
 
    // editor.removeNode(todeletNode);
    await editor.fromJSON(editorData);  
    await engine.abort();
    await engine.process(editor.toJSON());
   console.log("after update==>",editor.toJSON());
 

})


  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
  console.log(editor);
  return editor;
}

export function useRete(data) {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container,data).then((value) => {
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
