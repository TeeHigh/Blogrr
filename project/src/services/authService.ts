import axios from "axios";
import api from "../api";
import { RegisterFormData } from "../types/types";

export const loginApi = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/token/", { email, password });
    return res.data;
  } catch (err) {
    
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw err;
    }
  }
};

export const registerApi = async (formData: RegisterFormData) => {
  try {
    const res = await api.post("/api/user/register/", formData);
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to register");
    }
  }
};

export const checkEmailAvailabilityAPi = async (email: string) => {
  try {
    const res = await api.get("/api/check-email/", { params: { email } });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to check email availability");
    }
  }
};

export const verifyEmailOtpApi = async ({
  email,
  otp,
}: Record<string, string>) => {
  try {
    const res = await api.post("/api/verify-otp/", { email, otp });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to verify OTP");
    }
  }
};

export const sendOtpToEmailApi = async (email: string) => {
  try {
    const res = await api.post("/api/send-otp/", { email });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.tags) {
        throw new Error(err.response.data.tags.join(", "));
      }
      throw new Error("Failed to send OTP");
    }
  }
};
