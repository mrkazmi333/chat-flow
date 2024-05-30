import React, { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useDrop } from "react-dnd";
import NodesPanel, { NodeTypes } from "./NodesPanel";
import SettingsPanel from "./SettingsPanel";
import TextNode from "./TextNode";
import "../../App.css";

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
  text: TextNode,
};

const ChatFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showError, setShowError] = useState(false);
  const { project } = useReactFlow();

  /**
   * Callback function to handle the connection of nodes.
   * Checks if an edge already exists between the source and target nodes with the given handles.
   * If no existing edge is found, adds a new edge to the list of edges.
   * @param {object} params - Parameters for the connection.
   */
  const onConnect = useCallback(
    (params) => {
      // Check if there is already an edge between the source and target nodes with the given handles
      const existingEdge = edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );
      // If no existing edge is found, add a new edge to the list of edges
      if (!existingEdge) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    // Dependency array for useCallback hook
    [edges, setEdges]
  );

  /**
   * Function to handle saving of data.
   *
   * Retrieves the IDs of target nodes from edges, filters nodes without target handles,
   * and displays an error if there are multiple nodes without target handles.
   * If there's only one or no node without a target handle, it alerts "Save successful!".
   */
  const onClickSave = () => {
    // Retrieves the IDs of target nodes from edges
    const targetNodeIds = new Set(edges.map((edge) => edge.target));
    // Filters nodes without target handles
    const nodesWithEmptyTargetHandles = nodes.filter(
      (node) => !targetNodeIds.has(node.id)
    );

    // If there are multiple nodes without target handles, display an error
    if (nodesWithEmptyTargetHandles.length > 1) {
      setShowError(true);
      // Hide the error after 3 seconds
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      // If there's only one or no node without a target handle, alert "Save successful!"
      alert("Save successful!");
    }
  };

  /**
   * Hook that handles drop behavior for a draggable item.
   * @returns {Array} An array containing state variables and a reference function for the drop target.
   */
  const [{ canDrop, isOver }, drop] = useDrop(
    // Specifies the configuration object for the drop behavior
    () => ({
      // Specifies the types of items that can be accepted for dropping
      accept: [NodeTypes.TEXT],
      // Specifies the action to be taken when an item is dropped
      drop: (item, monitor) => {
        // Retrieves the client offset of the source item
        const offset = monitor.getSourceClientOffset();
        // Converts the client offset to project coordinates
        const position = project({ x: offset.x, y: offset.y });
        // Adds a new node to the graph at the calculated position
        addNode(item.type, position);
      },
      // Specifies what state variables to collect from the drag-and-drop monitor
      collect: (monitor) => ({
        // Indicates if the dragged item is currently hovering over the drop target
        isOver: !!monitor.isOver(),
        // Indicates if the dragged item can be dropped on the drop target
        canDrop: !!monitor.canDrop(),
      }),
    }),
    // Dependencies that trigger a re-render when changed
    [nodes, selectedNode]
  );

  /**
   * Function to add a new node to a graph.
   * @param {string} type - Type of the node.
   * @param {object} position - Position of the node.
   */
  const addNode = (type, position) => {
    // Get current timestamp
    const timestamp = Date.now();
    // Create a new node object with unique id, type, position, and label
    const newNode = {
      id: `${timestamp}`,
      type,
      position,
      data: { label: `${type} Message ${nodes.length + 1}` },
    };
    // Update the nodes state by adding the new node
    setNodes((nds) => nds.concat(newNode));
  };

  /**
   * Function to update the text of a selected node.
   * Updates the label of the selected node and its corresponding data in the nodes state.
   * @param {string} text - The new text to be assigned to the selected node.
   */
  const updateNodeText = (text) => {
    // Update the label of the selected node in the nodes state
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: text } }
          : node
      )
    );
    // Update the label of the selected node in the selectedNode state
    setSelectedNode((curNode) => ({
      ...curNode,
      data: {
        ...curNode.data,
        label: text,
      },
    }));
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node.id === selectedNode?.id ? null : node);
  };

  const handleBackToNodePanel = () => {
    setSelectedNode(null);
  };
  return (
    <div>
      <div className="panel-header">
        {showError ? (
          <div className="panel-header-error">Cannot save flow</div>
        ) : null}
        <button className="panel-header_save-btn" onClick={onClickSave}>
          Save changes
        </button>
      </div>
      <div style={{ display: "flex", height: "92vh" }}>
        <div style={{ flex: 1 }} ref={drop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            nodeTypes={nodeTypes}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        {selectedNode ? (
          <SettingsPanel
            selectedNode={selectedNode}
            updateNodeText={updateNodeText}
            handleBackToNodePanel={handleBackToNodePanel}
          />
        ) : (
          <NodesPanel />
        )}
      </div>
    </div>
  );
};

export default ChatFlow;
