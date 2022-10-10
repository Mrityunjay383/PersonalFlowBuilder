let spObj={};

function  conversion(nodes){
    let newObj={};
    newObj.nodes={};
    nodes.forEach((node)=>{
     newObj.nodes[node.id]={
      nodeId:node.id,
      title:node.data.preview,
      meta:{x:node.position[0],
        y:node.position[1]} 
    }
    
});
spObj=newObj;
return newObj;
}

function convNode(node){
    let nnode={};
   nnode.nodeId=node.id;  
   nnode.title=node.data.preview;
   nnode.meta={x:node.position[0],
  y:node.position[1]};

//   let input;
//   if(node.inputs.get("num1")===undefined){
//     nnode.parentNodeId="";
//   }
//   else{
//     input=node.inputs.get("num1");
//     let cn;
//     if(input.toJSON().connections[0]){
//         cn=input.toJSON().connections[0];
//             nnode.parentNodeId=cn.node;
        
//     }
//   }

  return nnode;
}


export {conversion,convNode,spObj};
