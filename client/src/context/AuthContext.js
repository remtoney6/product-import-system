import React, { createContext, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth_token")
  );

  // Login function
  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      if (response.data.data?.token) {
        localStorage.setItem("auth_token", response.data.data.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Register function
  const register = async (data) => {
    try {
      await api.post("/register", data);
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};