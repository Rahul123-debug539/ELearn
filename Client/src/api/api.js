import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

const API = axios.create({
  baseURL: "https://elearn-70zx.onrender.com"
});

// REQUEST: automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("le_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE: auto logout on 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Invalid / expired token
      localStorage.removeItem("le_token");
      localStorage.removeItem("le_user");

      // optional: toast message
      // (direct toast yahan nahi kar rahe to conflict na ho)

      // force reload to update UI + context
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
