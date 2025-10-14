// src/api/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from localStorage if present
const token = localStorage.getItem("token");
if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

export default instance;
