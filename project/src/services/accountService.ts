import api from "../api";
import Cookies from "js-cookie";
import { ProfileSettingsFormData, User } from "../types/types";

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

export const updateAccountApi = async (formData: Partial<ProfileSettingsFormData>) => {
  try {
    const res = await api.put("/api/user/update-profile/", formData, {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken") || "",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const deleteAvatarApi = async (publicId: string) => {
  try {
    const res = await api.delete(
      `/api/user/delete-avatar/${publicId}/`,
      config
    );
    return res.data;
  } catch (err) {
    console.error(err);
  }
};
