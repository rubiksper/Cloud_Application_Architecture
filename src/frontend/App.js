// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../frontend/Home";
import SignIn from "../frontend/SignIn";
import SignUp from "../frontend/SignUp";
import House from "../frontend/House"; 
import GuestHouse from "../frontend/GuestHouse"; 
import Dashboard from '../frontend/Dashboard'; 
import AdminProposal from '../frontend/AdminProposal'; 
import UserProposal from '../frontend/UserProposal'; 
import AdminHouse from '../frontend/AdminHouse'; 

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
        <Route path="/UserProposal" element={<UserProposal />} /> 
        <Route path="/AdminProposal" element={<AdminProposal />} /> 
        <Route path="/AdminHouse" element={<AdminHouse />} /> 
 
      </Routes>
    </Router>
  );
}

export default App;
