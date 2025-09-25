import api from "../api";

export const fetchUserDashboard = async () => {
  try{
    const res = await api.get("/api/dashboard/");
    return res.data;
  }
  catch(err){
    console.error("Error fetching user data:", err);
    throw err;
  }
};

export const fetchDashboardPosts = async (page: number, searchTerm?: string, filterStatus?: string) => {
  try {
    const url = new URL(`/api/dashboard/posts/`, api.defaults.baseURL);
    url.searchParams.append('page', page.toString());

    if (searchTerm) {
      url.searchParams.append('search', searchTerm);
    }

    if (filterStatus && filterStatus !== 'all') {
      url.searchParams.append('status', filterStatus); 
    }
    
    const finalUrl = `${url.pathname}${url.search}`;

    const res = await api.get(finalUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': api.defaults.headers.common['X-CSRFToken'] || '',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching dashboard posts:", err);
    throw err;
  }
};