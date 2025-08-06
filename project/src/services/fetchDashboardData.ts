import api from "../api";

export const fetchUser = async () => {
  const access = localStorage.getItem("access_token");

  if (!access) {
    throw new Error("No access token found");
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

  const res = await api.get("/api/dashboard/");
  return res.data;
};