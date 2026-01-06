import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch dashboard data on page load
  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // no token → go back to login
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: token }
      });

      const data = await response.json();

      if (data.message) {
        setMessage(data.message); // show welcome message
      } else {
        alert(data.error);
        navigate("/login"); // invalid token → back to login
      }

    } catch (error) {
      alert("Something went wrong! " + error);
      navigate("/login");
    }
  };

  // Run fetchDashboard when component mounts
  useEffect(() => {
    fetchDashboard();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
        <div className="card">
      <h2>Dashboard</h2>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
      </div>
      
    </div>
  );
}

export default Dashboard;
