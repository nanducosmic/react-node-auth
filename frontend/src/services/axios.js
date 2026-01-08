import axios from "axios";

const api = axios.create({
  baseURL: "https://luminous-spirit-production.up.railway.app/api",
  headers:{
    "Content-Type":"application/json"
  }
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
