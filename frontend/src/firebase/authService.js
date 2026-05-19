import {
  loginUser,
  registerUser,
  logoutUser
} from "../firebase/auth";

export const login = (email, password) =>
  loginUser(email, password);

export const register = (email, password) =>
  registerUser(email, password);

export const logout = () => logoutUser();
