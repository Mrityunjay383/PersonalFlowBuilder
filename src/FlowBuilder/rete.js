import React, { useState, useEffect, useRef } from "react";
import Rete from "rete";
import { createRoot } from "react-dom/client";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import Context from "efficy-rete-context-menu-plugin";
import { MyNode } from "./MyNode";
import { Action } from "./Action";

var numSocket = new Rete.Socket("Number value");

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

class NumComponent extends Rete.Component {
  constructor() {
    super( `Action`);
    this.data.component = MyNode
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

class AddComponent extends Rete.Component {
  constructor() {
    super("Start");
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
  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, { createRoot });
  editor.use(Context);

  var engine = new Rete.Engine("demo@0.1.0");

  editor.register(components);
  editor.register(components2);
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
    }
  );
  editor.on("updateconnection",async( el, connection, points)=>{
    console.log(el,connection,points);

  });
  editor.on("keydown",async(keyEvent)=>{
      if(keyEvent.key=="Enter"){
        var newnode= await components2.createNode();
        newnode.position = [400, 440];
        editor.addNode(newnode);

      }
  });
  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);

  return editor;
}

export function useRete() {
  const [container, setContainer] = useState(null);
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
        console.log("created");
        editorRef.current = value;
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
