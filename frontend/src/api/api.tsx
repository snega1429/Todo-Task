import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-task-4eka.onrender.com"
});



export default api;