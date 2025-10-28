import React from "react";

const NodeEditor = ({ selectedNode }) => {
  if (!selectedNode) {
    return <div className="node-editor">Select a node to edit</div>;
  }

  return (
    <div className="node-editor">
      <h3>Edit Node: {selectedNode.data.label}</h3>
      <input type="text" placeholder="Node label" />
      <button>Save</button>
    </div>
  );
};

export default NodeEditor;
