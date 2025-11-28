// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import MsmePage from "./pages/MsmePage";
import MapsPage from "./pages/MapsPage"; // or Home if you prefer that
import { Home } from "lucide-react";

const App = () => {
  return (
    <>
      {/* Simple navbar */}
      <nav className="bg-white shadow-md mb-6">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg">Data Tools</span>
          <div className="flex gap-4">
            <Link to="/msme" className="hover:text-blue-600 font-medium text-sm md:text-base">
              MSME UDYAM
            </Link>
            <Link to="/" className="hover:text-blue-600 font-medium text-sm md:text-base">
              udyam Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/msme" element={<MsmePage />} />
        <Route path="/" element={ <Home />} />
      </Routes>
    </>
  );
};

export default App;
