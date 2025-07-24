import api from "../api";

export async function getDashboardData() {
  try {
    const response = await api.get("/api/dashboard/");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}