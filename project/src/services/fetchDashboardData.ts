import api from "../api";

export const fetchUser = async () => {
  try{
    const res = await api.get("/api/dashboard/");
    return res.data;
  }
  catch(err){
    console.error("Error fetching user data:", err);
    throw err;
  }
};