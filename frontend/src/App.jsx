
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/registration/Register"
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import React from "react";
import "./App.css"; // <-- Global styling

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/task/login" element={<Login />} />
        <Route path="/task/register" element={<Register />} />
         <Route path="/logout" element={<Login />} />
         {/* Protected Route */}
        <Route
          path="/task/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
