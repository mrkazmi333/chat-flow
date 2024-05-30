import React from "react";
import { IoMdArrowBack } from "react-icons/io";

const SettingsPanel = ({
  selectedNode,
  updateNodeText,
  handleBackToNodePanel,
}) => {
  const handleChange = (event) => {
    updateNodeText(event.target.value);
  };

  return (
    <div style={{ borderLeft: "1px solid #ddd", width: "250px" }}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ddd",
          padding: "10px",
        }}
      >
        <IoMdArrowBack
          style={{ cursor: "pointer" }}
          onClick={handleBackToNodePanel}
        />
        <h4 style={{ margin: "0 auto" }}>Message</h4>
      </div>
      {selectedNode && (
        <div style={{padding: '16px', borderBottom: '1px solid #ddd'}}>
            <div>Text</div>
          <textarea
            type="text"
            value={selectedNode.data.label}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
