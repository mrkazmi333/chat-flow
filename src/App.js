import ChatFlow from "./components/ChatFlow/ChatFlow";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <ChatFlow />
      </ReactFlowProvider>
    </DndProvider>
  );
}

export default App;
