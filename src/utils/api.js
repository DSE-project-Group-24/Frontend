import axios from "axios";

const API = axios.create({
   baseURL: "http://127.0.0.1:8080/",
  //baseURL: "https://core-backend-production-5d7c.up.railway.app"
});

// Add JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
