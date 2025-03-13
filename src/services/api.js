import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api/v1",
  withCredentials: true, // ✅ Ensure cookies are sent with requests
});

export default API;
