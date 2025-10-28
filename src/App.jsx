import React, {
  useCallback,
  useState,
  useRef
} from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import { Download, Trash2, X, Plus } from "lucide-react";

/* ------------------------------------------------------------------
   NOTE: Because we're not importing shadcn components directly here,
   we’ll replace them with simple Tailwind-based components to avoid
   module errors (Render build-safe).
------------------------------------------------------------------- */

const Button = ({ children, onClick, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium ${variants[variant] || ""} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`border bg-white rounded-xl shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => <div className="border-b p-3 font-semibold">{children}</div>;
const CardContent = ({ children }) => <div className="p-3">{children}</div>;

const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`border rounded-md px-3 py-2 w-full ${className}`}
  />
);

/* ------------------------------------------------------------------
   FLOW BUILDER LOGIC
------------------------------------------------------------------- */

const DATA = {
  Widgets: [
    "Create Bank Method",
    "Create Card Method",
    "Edit Bank Method",
    "Edit Card Method",
    "Delete Bank Method",
    "Delete Card Method",
    "Add Deleted Bank Method",
    "Add Deleted Card Method",
    "Restrict from adding bank method when bank method is restricted on the account",
    "Restrict from adding card method when card method is restricted on the account",
    "Unenroll Card Method",
    "Unenroll Bank Method",
    "Unenroll Bank Method enrolled in multiple statement codes",
    "Unenroll Card Method enrolled in multiple statement codes",
    "Create Card method with invalid cvv",
    "Create card method with invalid zipcode",
    "Create card method with invalid Card Number",
    "Create bank method with invalid routing number",
    "Create bank method with invalid bank account number",
  ],
  Submission: [
    "Create Bank Immediate Transaction",
    "Create Card Immediate Transaction",
    "Create Bank Scheduled Transaction",
    "Create Card Scheduled Transaction",
    "Create Bank Future-dated Transaction",
    "Create Card Future-dated Transaction",
    "Create Promise Transaction",
    "Create Extension Transaction",
    "Create eRefund",
    "Create Transaction with Service Category and Receivables",
    "Create multiple transactions",
  ],
  Transaction: [
    "Cancel Immediate Bank Transaction",
    "Reverse Immediate Card Transaction",
    "Cancel Scheduled Bank Transaction",
    "Cancel Scheduled Card Transaction",
    "Cancel Future-dated Bank Transaction",
    "Cancel Future-dated Card Transaction",
    "Cancel eRefund Transaction",
    "Refund Card Transaction",
    "Dispute Bank Transaction",
    "Dispute Card Transaction",
    "Edit Scheduled Bank Transaction",
    "Edit Future-dated Bank Transaction",
    "Edit Scheduled Card Transaction",
    "Edit Future-dated Card Transaction",
    "Cancel Recurring Bank Transaction",
    "Cancel Recurring Card Transaction",
  ],
};

function FlowBuilder() {
  const [activeTab, setActiveTab] = useState("Widgets");
  const [query, setQuery] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [customCardName, setCustomCardName] = useState("");
  const reactFlowWrapper = useRef(null);
  const { setViewport } = useReactFlow();

  const addNode = (module, name, position = { x: 250, y: 100 }) => {
    const id = `${Date.now()}_${Math.random()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        position,
        draggable: true,
        data: { label: name, module },
        style: {
          borderRadius: 12,
          border: "2px solid #555",
          padding: "10px 18px",
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
          minWidth: "200px",
          fontSize: "14px",
        },
      },
    ]);
    if (DATA[module]) DATA[module] = DATA[module].filter((item) => item !== name);
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const removeNode = (id, label, module) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    if (module && DATA[module]) DATA[module].push(label);
  };

  const exportJSON = () => {
    try {
      const fileData = JSON.stringify({ nodes, edges }, null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `flow_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Check console.");
    }
  };

  const createCustomCard = () => {
    if (!customCardName.trim()) return;
    addNode("Custom", customCardName.trim());
    setCustomCardName("");
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const module = event.dataTransfer.getData("module");
      const name = event.dataTransfer.getData("name");
      const position = {
        x: (event.clientX - bounds.left) / 1.5,
        y: (event.clientY - bounds.top) / 1.5,
      };
      addNode(module, name, position);
      setTimeout(() => setViewport({ x: 0, y: 0, zoom: 0.9 }), 100);
    },
    [setViewport]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="grid grid-cols-12 h-screen p-3 gap-3 bg-gray-50">
      {/* Left Panel */}
      <Card className="col-span-3">
        <CardHeader>Library</CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            {Object.keys(DATA).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "ghost"}
                className="flex-1"
              >
                {tab}
              </Button>
            ))}
          </div>

          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-3"
          />

          <div className="overflow-y-auto h-[60vh] border rounded-md p-2">
            {DATA[activeTab]
              .filter((n) => n.toLowerCase().includes(query.toLowerCase()))
              .map((name) => (
                <div
                  key={name}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("module", activeTab);
                    e.dataTransfer.setData("name", name);
                  }}
                  className="cursor-move border rounded-md p-2 mb-2 hover:bg-gray-100"
                >
                  {name}
                </div>
              ))}
          </div>

          <div className="mt-4">
            <Input
              placeholder="New card name..."
              value={customCardName}
              onChange={(e) => setCustomCardName(e.target.value)}
              className="mb-2"
            />
            <Button onClick={createCustomCard} className="w-full flex items-center justify-center">
              <Plus className="h-4 w-4 mr-1" /> Create Custom Card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flow Editor */}
      <Card className="col-span-9">
        <CardHeader>Flow Editor</CardHeader>
        <CardContent className="h-[80vh]">
          <div
            ref={reactFlowWrapper}
            style={{ width: "100%", height: "100%" }}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <ReactFlow
              nodes={nodes.map((n) => ({
                ...n,
                data: {
                  ...n.data,
                  label: (
                    <div
                      className="relative border rounded-lg bg-white px-4 py-2 flex items-center justify-between shadow-md"
                      style={{
                        width: "max-content",
                        maxWidth: "100%",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="font-medium">{n.data.label}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2 p-1"
                        onClick={() => removeNode(n.id, n.data.label, n.data.module)}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  ),
                },
              }))}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              defaultViewport={{ zoom: 0.9 }}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
            >
              <Background />
              <MiniMap />
              <Controls />
            </ReactFlow>
          </div>

          <div className="mt-3 flex gap-2">
            <Button onClick={exportJSON}>
              <Download className="h-4 w-4 mr-1" /> Export Flow
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setNodes([]);
                setEdges([]);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}
