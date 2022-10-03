import React from "react";
import {Control, Node, Socket} from "rete-react-render-plugin";
import {publish} from "../events";

export class Action extends Node {
  render() {
    const {node, bindSocket, bindControl} = this.props;
    const {outputs, controls, inputs} = this.state;

    return (
      <div
        draggable
        onMouseDown={(e) => {
          publish("node.mouse.down", e);
        }}
        onMouseOver={(e) => {
          publish("node.mouse.over", e);
        }}
        onMouseOut={(e) => {
          publish("node.mouse.out", e);
        }}
        onMouseUp={(e) => {
          publish("node.mouse.up", e);
        }}
        onDragStart={(d) => {
          publish("node.drag.start", d);
        }}
        onDragEnd={(d) => {
          publish("node.drag.end", d);
        }}  
        className={`node    flowBuilder_${node.id}`}
      >
        {/* Inputs */}
        {inputs.map((input) => (
          <div className=" flowBuilder_${node.id}_title " key={input.key}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {/* <img alt="playicon" className="playIcon" src={playIcon}/> */}
            {node.data.preview}
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
          <div className="output" key={output.key}>
          
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
