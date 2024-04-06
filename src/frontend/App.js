// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import House from "./House"; 
import GuestHouse from "./GuestHouse"; 
import Dashboard from './Dashboard'; 
import AdminProposal from './AdminProposal';
import AdminHouse from './AdminHouse'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<House />} />
        <Route path="/guest" element={<GuestHouse />} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/GuestProposal" element={<GuestProposal />} /> 
        <Route path="/AdminProposal" element={<AdminProposal />} /> 
        <Route path="/AdminHouse" element={<AdminHouse />} /> 
 
      </Routes>
    </Router>
  );
}

export default App;
