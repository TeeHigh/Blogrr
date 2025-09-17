// axios instance
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


// api.defaults.xsrfCookieName = "csrftoken";
// api.defaults.xsrfHeaderName = "X-CSRFToken";

export default api;
