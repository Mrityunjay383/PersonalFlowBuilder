import React from "react";
import {Control, Node, Socket} from "rete-react-render-plugin";
import {publish} from "../events";
import "./nodes.css"
export class MyNode extends Node {
  render() {
    const {node, bindSocket, bindControl} = this.props;
    const {outputs, controls, inputs, selected} = this.state;

    return (
      <div style={{border:"none" ,background:"inherit", }}
        draggable={true}
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
        className={`node   flowBuilder_${node.id}`}
      
      >
        <div className={ `flowBuilder_${node.id}_title`} >

          {/* <img className="playIcon" src={playIcon}/>  */}
          {/* {node.data.preview} */}

        </div>
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
      
        {outputs.map((output) => (
          <div   className="output" key={output.key}>
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
