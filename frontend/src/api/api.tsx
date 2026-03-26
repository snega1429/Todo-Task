import  axios from "axios";


const API = axios.create({
  baseURL: "https://todo-task-4eka.onrender.com",
            
});

API.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem("token");

  if (token) { 
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => {
  return Promise.reject(error);
}
);

export default API;