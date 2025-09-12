//

import { useEffect } from "react";
import api from "../api"; 

function CSRFToken() {
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        await api.get("/api/get-csrf-token/");
      } catch (error) {
        console.error("Error ensuring CSRF cookie is set:", error);
      }
    };
    fetchCsrf();
  }, []);

  return null;
}

export default CSRFToken;
