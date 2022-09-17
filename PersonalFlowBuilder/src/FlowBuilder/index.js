import React from "react";
import {publish, subscribe} from "./events.js";
import {useRete} from "./rete.js";

function Editor({data}) {
  const [setContainer] = useRete(data);
  return (
    <>
      <div
        style={{
          backgroundColor: "inherit",
       
        }}
        ref={(ref) => ref && setContainer(ref)}
      ></div>
    </>
  );
}

let x, y, zoom;
subscribe("catchPosition", async ({detail}) => {
  x = detail.x;
  y = detail.y;
  zoom = detail.zoom;

});

 class Flowbuilder extends React.Component {
  constructor(props) {
    super(props);
  }
 render(){
  this.renderArrow = function (fromNodeId, toNodeId, data) {
    publish("renderArrow", {fromNodeId, toNodeId, data});
  }
  this.reset = function () {
    publish("resetEverything");
  }
  this.position ={
    setPosition: function (x, y, zoom) {
      console.log("setposition called", x, y, zoom);
      publish("setPosition", {x, y, zoom});
    },
    getPosition: async function () {

      await publish("getPosition");

      return {x, y, zoom};
    },
    reset: function () {
      publish("positionReset");
    }
  }
  this.nodes= {
    add: function (node) {
      publish("add node", node);
    },
    remove: function (nodeId) {
      publish("delete node", nodeId);
    },
    reset: function () {
      publish("nodesPositionReset");
    },
  }
  this.on= function (eventName, listener) {
    document.addEventListener(eventName, listener);
  }
  return (
  <Editor data={this.props}/>
  );
}
}

export default Flowbuilder;
