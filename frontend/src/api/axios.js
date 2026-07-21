import axios from "axios";

const api = axios.create({
  baseURL: "https://dqi-api.onrender.com/api/",
});


// Automatically attach JWT access token
api.interceptors.request.use(
  (config) => {

    const accessToken =
      localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


export default api;