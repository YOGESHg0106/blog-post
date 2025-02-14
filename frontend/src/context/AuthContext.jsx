import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "https://blog-post-production-f5b3.up.railway.app"; // ✅ Update with your backend URL

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ Load user/token from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`; // ✅ Auto-set token for requests
    }
  }, []);

  // ✅ Login Function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      console.log("Login Response:", res.data); // Debugging

      if (!res.data.token) {
        alert("Login failed: No token received!");
        return;
      }

      // ✅ Store user and token
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      // ✅ Set token in Axios for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err);
      alert(err.response?.data?.message || "Invalid email or password!");
    }
  };

  // ✅ Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"]; // ✅ Remove token from Axios
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
