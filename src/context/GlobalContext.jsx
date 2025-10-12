// src/context/GlobalContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedToken = localStorage.getItem("userToken");

    if (storedUserData && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("userData");
        localStorage.removeItem("userToken");
      }
    }

    const AUTH_CHANGE_EVENT = "auth-state-change";

    const onAuthChange = (event) => {
      const newUser = event?.detail?.user ?? null;
      if (newUser) {
        setUser(newUser);
      } else {
        const stored = localStorage.getItem("userData");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    const onStorage = (e) => {
      if (e.key === "userData" || e.key === "userToken") {
        const stored = localStorage.getItem("userData");
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, onAuthChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, onAuthChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
