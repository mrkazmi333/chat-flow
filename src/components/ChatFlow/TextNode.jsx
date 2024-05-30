import React from "react";
import { Handle, Position } from "reactflow";
import { MdMessage } from "react-icons/md";

const TextNode = ({ data, isConnectable, selected }) => {
  return (
    <div style={{minWidth: '200px', borderRadius: '6px',  border: selected ? "1px solid #696dec" : "#fff", overflow: 'hidden' }}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div
        style={{
          background: "aqua",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: '10px'
        }}
      >
        <MdMessage />
        Message
      </div>
      <div style={{padding: '10px'}}>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default TextNode;
