import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";
import playIcon from "./images/playIcon.svg";
export class Action extends Node {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div className={`node actionNode`} style={{ background: "#FDFDFD"}}>
        
  {/* Inputs */}
  {inputs.map((input) => (
          
            <div className="title actionTitle"key={input.key} >
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />   
            <img className="playIcon"src={playIcon}/> {node.name} 
            </div>
            
          
        ))}
      
        {/* Controls */}
        {controls.map((control) => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}
      
          {outputs.map((output) => (
          <div className="output" key={output.key}>
            <div className="output-title" style={{fontSize:"10px"}}> {output.name}</div>
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
