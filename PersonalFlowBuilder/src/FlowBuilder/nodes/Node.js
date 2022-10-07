import React from "react";
import {Control, Node, Socket} from "rete-react-render-plugin";
import {publish, publishedReturn} from "../events";
import "./nodes.css"
export class Action extends Node {
  render() {
    const {node, bindSocket, bindControl} = this.props;
    const {outputs, controls, inputs} = this.state;

    return (
      <div style={{border:"none" ,background:"inherit"}}
        draggable
        onMouseDown={(e) => {
          publishedReturn("node.mouse.down", {event:e.nativeEvent,node});
        }}
        onMouseOver={(e) => {
          publishedReturn("node.mouse.over", {event:e.nativeEvent,node});
        }}
        onMouseOut={(e) => {
          publishedReturn("node.mouse.out", {event:e.nativeEvent,node});
        }}
        onMouseUp={(e) => {
          publishedReturn("node.mouse.up", {event:e.nativeEvent,node});
        }}
        className={`node    flowBuilder_${node.id}`}
      >
        {/* Inputs */}
        {inputs.map((input,index) => (
           <div key={index}>
          <div style={{display:"flex"}} className=" flowBuilder_${node.id}_title " key={input.key}>
          <div style={{visibility:"hidden"}}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            
          </div>
            
          </div>
          </div>
            ))}
        
        {/* Controls  */}
        {controls.map((control) => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}

        {outputs.map((output) => (
          <div  className="output" style ={{visibility: "hidden"}}key={output.key}>
          
            <Socket
              type="output"
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}
      </div>
    );
  }
}
