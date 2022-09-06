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
    console.log("this is control ",node)
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
  constructor() {
    super( `Action`);
    this.data.component =Action
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
  constructor() {
    super("Start");
    this.data.noContextMenu = true;
    this.data.component = MyNode; // optional
  }

  builder(node) {
  var out = new Rete.Output("num", "The First Step", numSocket);
    {console.log(node)}
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

export async function createEditor(container) {
  var components = new AddComponent();
  var components2=new NumComponent();
  var conditionComponent=new ConditonComponent();
  var DelayComponent =new SmartDelayComponent();
  var editor = new Rete.NodeEditor("Flow@0.1.0", container);
  const selector=new SelectorComponent();
  editor.use(ConnectionPlugin,);
  editor.use(ReactRenderPlugin, { createRoot });

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
  var add = await components.createNode();
  add.position = [500, 240];


  editor.addNode(add);

 add.inputs.get("num1");
 add.inputs.get("num2");

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      console.log(editor.toJSON())
      await engine.abort();

      await engine.process(editor.toJSON());
      console.log("editor-->",editor)
    }
  );
  editor.on("updateconnection",async( el, connection, points)=>{
    console.log(el,connection,points);

  });
  editor.on("connectioncreate",async(connection)=>{
      console.log("this is connection==>",connection);
  });
  editor.on("keydown", async(keyEvent)=>{
      if(keyEvent.key=="Enter"){
        var newnode= await components2.createNode();
        newnode.position = [400, 240];
        editor.addNode(newnode);

        await engine.abort();

        await engine.process(editor.toJSON());

      }
  });

  let x,y;
  editor.on("connectionpath", async (data) => {
    // console.log("connectionpath ", data);
    [x, y] = [data.points[2], data.points[3]];
  })
let pointerEvent;
let  view=editor.view;
editor.on("click",async(e)=>{
  console.log(e.e);
  pointerEvent=e;

});
  editor.on("connectiondrop", async (data1) => {
    // console.log("connectiondrop ", data1);
    editor.trigger("contextmenu",{pointerEvent,view});
    // var newnode= await components2.createNode();
    // newnode.position = [x, y];
    //   console.log("newnode -->",newnode);
    //   const connections={input:add,output:newnode};
    //   editor.addNode(newnode);
    //  editor.connect(data1,newnode.inputs.get("num1"));

    // await engine.abort();

    // await engine.process(editor.toJSON());
  })

 
  editor.on('contextmenu', ({e,view}) => {
    console.log("mouseEvent of context menu-->" ,e,view);

    // console.log(node);
    // return true;
});


  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
  console.log(editor);
  return editor;
}

export function useRete() {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
        console.log("created");
        console.log("current value of editerRef",editorRef.current);
        editorRef.current = value;
        console.log("this is editerref==>:",value);
      });
    }
  }, [container]);

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        console.log("destroy");
        editorRef.current.destroy();
      }
    };
  }, []);

  return [setContainer];
}
