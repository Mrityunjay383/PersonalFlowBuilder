import React from "react";
import {Control, Node, Socket} from "rete-react-render-plugin";
import {publish, publishedReturn} from "../events";
import { convNode,conversion,spObj} from "../utils/conversion";
import "./nodes.css" 
export class MyNode extends Node {
  render() {
    const {node, bindSocket, bindControl} = this.props;
    const {outputs, controls, inputs, selected} = this.state;

    return (
      <div id={`${node.id}`} style={{border:"none" ,background:"inherit",}}
      className={`node flow-builder-${node.id}`} 
      draggable={true}
        onMouseDown={(e) => {
          publishedReturn("node.mouse.down", {event:e.nativeEvent,node:convNode(node),options:spObj});
        }}
        onMouseEnter={(e) => {
          e.preventDefault();
          if(e.relatedTarget.id==="123"){
            publishedReturn("node.mouse.over", {event:e.nativeEvent,node:convNode(node),options:spObj});
          }
          else{
            publishedReturn("node.mouse.out", {event:e.nativeEvent,node:convNode(node),options:spObj});
          }
         
          }}
        onMouseUp={(e) => {
          publishedReturn("node.mouse.up", {event:e.nativeEvent,node:convNode(node),options:spObj});
        }}
        >
        {/* Outputs */}

        {/* Controls */}
        
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
          <div   className="flow-builder-output" key={output.key}>
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
