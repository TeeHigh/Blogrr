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

export async function createBlogApi(){
  try {
    const response = await api.post("/api/blog/create/");
    return response.data;
  }
  catch(err){
    console.error("Error creating blog:", err)
  }
}

export async function updateBlogApi(){
  
}

export async function deleteBlogApi(id: string){

}