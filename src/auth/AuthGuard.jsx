import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children, required }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    if (required && !loginData) {
      // If login is required but user is not logged in
      navigate("/login");
    } else if (!required && loginData) {
      // If login is NOT required (like login/register pages)
      // but user is already logged in
      navigate("/dashboard");
    }
  }, [navigate, required]);

  return children;
};

export default AuthGuard;
