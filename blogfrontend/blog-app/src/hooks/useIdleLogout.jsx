import { useEffect } from "react";

const useIdleLogout = ({ logoutCallback, timeout = 10 * 60 * 1000 }) => {
  useEffect(() => {
    const checkIdle = () => {
      const now = Date.now();
      const lastActive = localStorage.getItem("lastActive");
      if (lastActive && now - Number(lastActive) > timeout) {
        logoutCallback();
      }
    };

    const updateActivity = () => {
      localStorage.setItem("lastActive", Date.now());
    };

    // Initial set
    updateActivity();

    // Event listeners to track activity
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // Idle check interval
    const interval = setInterval(checkIdle, 10000); // check every 10s

    // Cleanup
    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [logoutCallback, timeout]);
};

export default useIdleLogout;

