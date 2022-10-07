import React from "react";
import {Control, Node, Socket} from "rete-react-render-plugin";
import {publish, publishedReturn} from "../events";
import "./nodes.css" 
export class MyNode extends Node {
  render() {
    const {node, bindSocket, bindControl} = this.props;
    const {outputs, controls, inputs, selected} = this.state;

    return (
      <div style={{border:"none" ,background:"inherit", }}
        draggable={true}
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
