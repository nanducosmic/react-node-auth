import { loginStart, loginSuccess, loginFailure } from "./authSlice";

export const loginUser = (email, password) => {
  return async (dispatch) => {
    try {
      dispatch(loginStart());

      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(loginSuccess(data.token));
      } else {
        dispatch(loginFailure(data.error || "Login failed"));
      }

    } catch (error) {
      dispatch(loginFailure("Server error"));
    }
  };
};
