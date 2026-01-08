import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("https://luminous-spirit-production.up.railway.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("REGISTER RESPONSE:", data);

      if (data.message) {
        alert(data.message);
        navigate("/login");
        localStorage.removeItem("token");
  localStorage.removeItem("role");
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
  <form on onSubmit={handleRegister}>
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
      </form>

      <div className="link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  </div>
);



  
}

export default Register;
