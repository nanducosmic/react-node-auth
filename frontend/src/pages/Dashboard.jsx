import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboardMessage, logout } from "../features/auth/authSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get Redux auth state
  const { token, message, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Fetch dashboard message on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // no token → redirect
    } else {
      dispatch(fetchDashboardMessage());
    }
  }, [dispatch, isAuthenticated, navigate]);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>

        {/* Loading state */}
        {loading && <p>Loading...</p>}

        {/* Error state */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Welcome message */}
        {!loading && !error && <p>{message}</p>}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
