import { useEffect } from "react";

const useIdleLogout = ({ logoutCallback, timeout = 10 * 60 * 1000 }) => {
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActive", Date.now().toString());
    };

    const checkIdle = () => {
      const now = Date.now();
      const lastActive = Number(localStorage.getItem("lastActive"));
      if (lastActive && now - lastActive > timeout) {
        logoutCallback();
      }
    };

    // Initial activity timestamp
    updateActivity();

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    const interval = setInterval(checkIdle, 10000); // check every 10s

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [logoutCallback, timeout]);
};

export default useIdleLogout;
