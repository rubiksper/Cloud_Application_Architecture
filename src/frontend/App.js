// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../frontend/Home";
import SignIn from "../frontend/SignIn";
import SignUp from "../frontend/SignUp";
import House from "../frontend/House"; // Importez le composant House
import GuestHouse from "../frontend/GuestHouse"; // Importez le composant House
import Dashboard from '../frontend/Dashboard'; // Importez le composant Dashboard
import AdminProposal from '../frontend/AdminProposal'; // Importez le composant Dashboard
import GuestProposal from '../frontend/GuestProposal'; // Importez le composant Dashboard
import AdminHouse from '../frontend/AdminHouse'; // Importez le composant Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<House />} />
        <Route path="/guest" element={<GuestHouse />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Nouvelle route pour le dashboard */}
        <Route path="/GuestProposal" element={<GuestProposal />} /> {/* Nouvelle route pour le dashboard */}
        <Route path="/AdminProposal" element={<AdminProposal />} /> {/* Nouvelle route pour le dashboard */}
        <Route path="/AdminHouse" element={<AdminHouse />} /> {/* Nouvelle route pour le dashboard */}
 
      </Routes>
    </Router>
  );
}

export default App;
