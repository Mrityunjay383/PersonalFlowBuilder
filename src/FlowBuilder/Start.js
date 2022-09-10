import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";
import playIcon from "./images/playIcon.svg";
import "../App.css";
import { publish } from "./events";
export class MyNode extends Node {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div
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
        className={`node`}
        style={{ background: "#FDFDFD" }}
      >
        <div className="title">
          <img className="playIcon" src={playIcon} /> {node.name}
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
        {/* Inputs */}
        {inputs.map((input) => (
          <div className="input" key={input.key}>
            <Socket
              style={{ backgroundColor: "red" }}
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {!input.showControl() && (
              <div className="input-title">{input.name}</div>
            )}
            {input.showControl() && (
              <Control
                className="input-control"
                control={input.control}
                innerRef={bindControl}
              />
            )}
          </div>
        ))}
        {outputs.map((output) => (
          <div className="output" key={output.key}>
            <div className="output-title" style={{ fontSize: "10px" }}>
              {" "}
              {output.name}
            </div>
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
