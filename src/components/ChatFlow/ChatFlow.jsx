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

  const onConnect = useCallback(
    (params) => {
      const existingEdge = edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );
      if (!existingEdge) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [edges, setEdges]
  );

  const onClickSave = () => {
    const targetNodeIds = new Set(edges.map((edge) => edge.target));
    const nodesWithEmptyTargetHandles = nodes.filter(
      (node) => !targetNodeIds.has(node.id)
    );

    if (nodesWithEmptyTargetHandles.length > 1) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      alert("Save successful!");
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NodeTypes.TEXT],
      drop: (item, monitor) => {
        const offset = monitor.getSourceClientOffset();
        const position = project({ x: offset.x, y: offset.y });
        addNode(item.type, position);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [nodes, selectedNode]
  );

  const addNode = (type, position) => {
    const timestamp = Date.now(); // Get current timestamp
    const newNode = {
      id: `${timestamp}`,
      type,
      position,
      data: { label: `${type} Message ${nodes.length + 1}` },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateNodeText = (text) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, label: text } }
          : node
      )
    );
    setSelectedNode((curNode) => ({
      ...curNode,
      data: {
        ...curNode.data,
        label: text,
      },
    }));
  };

  // const onNodeClick = (event, node) => {
  //   setSelectedNode(node);
  // };

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
