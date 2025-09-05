// app/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:9000/", 
});

export default API;
