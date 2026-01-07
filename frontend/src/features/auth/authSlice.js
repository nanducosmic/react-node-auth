import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/axios"; // your Axios instance

// ✅ Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { email, password });

      const { token, role, email: userEmail } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      return { token, role, email: userEmail };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);


// ✅ Async thunk to fetch dashboard message
export const fetchDashboardMessage = createAsyncThunk(
  "auth/fetchDashboardMessage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard");
      return response.data.message;
    } catch (err) {
      return rejectWithValue("Unauthorized");
    }
  }
);

// ✅ Initial state
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  user: {
    role: localStorage.getItem("role") || "user"
  },
  message: "",
  loading: false,
  error: null
};

// ✅ Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.message = "";
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
     .addCase(loginUser.fulfilled, (state, action) => {
  state.loading = false;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.user = {
    role: action.payload.role,
    email: action.payload.email
  };
});


    // Dashboard message
    builder
      .addCase(fetchDashboardMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(fetchDashboardMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
