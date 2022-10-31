import React from "react";
import {Control, Node, Socket} from "rete-react-render-plugin";
import {publish, publishedReturn} from "../events";
import { convNode,conversion,spObj} from "../utils/conversion";
import "./nodes.css"
export class Action extends Node {
  render() {
    const {node, bindSocket, bindControl} = this.props;
    const {outputs, controls, inputs} = this.state;

    return (
      <div id={`${node.id}`} style={{border:"none" ,background:"inherit",}}
        draggable
        onMouseDown={(e) => {
          publishedReturn("node.mouse.down", {event:e.nativeEvent,node:convNode(node),options:spObj});
        }}
        onMouseEnter={(e) => {
          e.preventDefault();
          if(e.relatedTarget.id==="123"){
            publishedReturn("node.mouse.over", {event:e.nativeEvent,node:convNode(node),options:spObj});
          }
          else if(e.relatedTarget.id!=="123"){
            publishedReturn("node.mouse.out", {event:e.nativeEvent,node:convNode(node),options:spObj});
          }
        }}
        onMouseUp={(e) => {
          publishedReturn("node.mouse.up", {event:e.nativeEvent,node:convNode(node),options:spObj});
        }}
        className={`node    flow-builder-${node.id}`}
      >
        {/* Inputs */}
        {inputs.map((input,index) => (
           <div key={index}>
          <div style={{display:"flex"}} className=" flow-builder-${node.id}_title " key={input.key}>
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
        
        <div>
        {outputs.map((output) => (
          <div  className="flow-builder-output" style ={{visibility: "hidden"}}key={output.key}>
            <Socket
              type="output"
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}
        </div>
      </div>
    );
  }
}
