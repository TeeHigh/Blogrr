import api from "../api";
import Cookies from "js-cookie";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken") || "",
  },
  withCredentials: true,
};

export const deleteAccountApi = async () => {

  try {
    const res = await api.delete("/api/user/delete-account/", config);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const updateAccountApi = async (formData: FormData) => {
  
}
