import api from "../api";
import { RegisterFormData } from "../types/types";

export const loginApi = async (email: string, password: string) => {
  const res = await api.post('/api/token/', { email, password });
  return res.data;
};

export const registerApi = async (formData: RegisterFormData) => {
  const res = await api.post('/api/user/register/', formData);
  return res.data;
};

export const checkEmailAvailabilityAPi = async (email: string) => {
  const res = await api.get('/api/check-email/', { params: { email } });
  return res.data;
}

export const verifyEmailOtpApi = async ({email, otp}: Record<string, string>) => {
  const res = await api.post('/api/verify-otp/', { email, otp });
  return res.data;
}

export const sendOtpToEmailApi = async (email: string) => {
  const res = await api.post('/api/send-otp/', { email });
  return res.data;
}