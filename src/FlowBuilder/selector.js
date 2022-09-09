import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";
import { publish } from "./events";
import playIcon from "./images/playIcon.svg";
export class Selector extends Node {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div 
      onMouseDown={(e)=>{
        publish("node.mouse.down",e)}} 
         onMouseOver={(e)=>{
          publish("node.mouse.over",e)}}
          onMouseOut={(e)=>{
            publish("node.mouse.out",e)}}
            onMouseUp={(e)=>{
              publish("node.mouse.up",e)}}
          onDragStart={(d)=>{
            console.log("onDrag start --->",d)
            publish("node.drag.start",d);
          }}
          onDragEnd={(d)=>{
            publish("node.drag.end",d);
          }}
          onDrag={()=>{
            console.log("heheheheheheh");
          }}
          draggable
      className={`node`} style={{ background: "#FDFDFD"}}>
        
  {/* Inputs */}
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
        {inputs.map((input) => (
          <div className="input" key={input.key}>
            <div className="title">
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />   
            <img className="playIcon"src={playIcon}/> {node.name} 
            </div>
            
          </div>
        ))}
        </div>
      </div>
    );
  }
}
