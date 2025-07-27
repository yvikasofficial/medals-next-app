import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.jsonbin.io/v3/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
