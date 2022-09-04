import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";
import playIcon from "./images/playIcon.svg";
export class Selector extends Node {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div className={`node`} style={{ background: "#FDFDFD"}}>
        
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
