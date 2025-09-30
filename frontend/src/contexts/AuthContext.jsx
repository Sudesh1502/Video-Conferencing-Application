import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import axios from "axios";
export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:8000/users",
});

export const AuthProvider = ({ children }) => {
  const router = useNavigate();
  const handleRegister = async (username, email, password) => {
    try {
      let request = await client.post("/register", { email, username, password });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      let request = await client.post("/login", { email, password });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        return request.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const data = {
    handleRegister,
    handleLogin,
  };
  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
