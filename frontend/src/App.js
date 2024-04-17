import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Login and Sign up/Signup";
import Login from "./Login and Sign up/Login";
import Dashboard from "./Dashboard/Dashboard";
import EmployeePage from "./EmployeePage/EmployeePage";
import Update from "./Update/Update";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Login />} /> // Use element prop
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employeepage" element={<EmployeePage />} />
          <Route path="/update" element={<Update />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
