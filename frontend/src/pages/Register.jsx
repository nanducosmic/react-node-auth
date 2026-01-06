import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.message) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  return (
   

  <div className="container">
    <div className="card">
      <h2>Register</h2>

      <input
        className="input"
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button className="button" onClick={handleRegister}>
        Register
      </button>

      <div className="link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  </div>
);



  
}

export default Register;
