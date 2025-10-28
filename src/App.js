import React from "react";
import FlowCanvas from "./components/FlowCanvas";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <FlowCanvas />
    </div>
  );
}

export default App;
