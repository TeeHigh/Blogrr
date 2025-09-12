import axios from "axios";

// Create the main Axios instance for authenticated requests
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Configure Axios to automatically handle CSRF tokens
api.defaults.xsrfCookieName = "csrftoken";
api.defaults.xsrfHeaderName = "X-CSRFToken";

export default api;