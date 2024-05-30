import React from "react";
import { useDrag } from "react-dnd";
import { MdMessage } from "react-icons/md";

const NodeTypes = {
  TEXT: "text",
};

const DraggableNode = ({ type, label }) => {
  /**
   * Hook to enable dragging functionality for an element.
   * Enables dragging of an element of the specified type.
   * @returns {Array} An array containing state variables and a reference function for dragging.
   */
  const [{ isDragging }, drag] = useDrag(() => ({
    // Specifies the type of the dragged item
    type,
    // Specifies the item to be dragged
    item: { type },
    // Collects the dragging state from the drag-and-drop monitor
    collect: (monitor) => ({
      // Indicates whether the item is currently being dragged
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: "8px",
        margin: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "1px solid #696dec",
        gap: "10px",
        color: "#696dec",
        cursor: "move",
        width: "150px",
        borderRadius: "6px",
      }}
    >
      <MdMessage style={{ color: "#696dec" }} />
      {label}
    </div>
  );
};

const NodesPanel = () => {
  return (
    <div
      style={{ padding: "16px", borderLeft: "1px solid #ddd", width: "250px" }}
    >
      <h3 style={{ margin: "10px 0" }}>Nodes Panel</h3>
      <DraggableNode type={NodeTypes.TEXT} label="Message" />
    </div>
  );
};

export default NodesPanel;
export { NodeTypes };
