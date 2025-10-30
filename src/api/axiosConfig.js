// src/api/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "  https://digitalhat-server-02.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from localStorage if present
const token = localStorage.getItem("token");
if (token)
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default instance;
