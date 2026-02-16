import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      
      try {
        // Get auth data with proper error handling
        const authDataStr = localStorage.getItem("authData");
        let users = [];
        
        if (authDataStr) {
          try {
            const parsed = JSON.parse(authDataStr);
            // Handle different possible formats
            if (Array.isArray(parsed)) {
              users = parsed;
            } else if (parsed && typeof parsed === 'object') {
              // If it's a single object, wrap in array
              users = [parsed];
            }
          } catch (e) {
            console.error("Error parsing authData:", e);
            users = [];
          }
        }

        // Debug: Log what we have
        console.log("Users from localStorage:", users);
        console.log("Login attempt with:", loginData);

        // Find user with matching email and password
        const authenticatedUser = users.find(
          (user) =>
            user?.email === loginData.email &&
            user?.password === loginData.password,
        );

        if (authenticatedUser) {
          // Store current login session data
          localStorage.setItem("loginData", JSON.stringify({
            email: loginData.email,
            username: authenticatedUser.username || loginData.email.split("@")[0]
          }));
          
          toast.success("Login successful!");
          navigate("/dashboard"); // Note: lowercase d to match your route
        } else {
          toast.error("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred during login");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">WELCOME BACK</h1>
      <h5>Sign in to your account</h5>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginData.email}
            placeholder="Enter your email"
            onChange={handleInputChange}
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password with eye icon */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={loginData.password}
              placeholder="Enter your password"
              onChange={handleInputChange}
              style={{ paddingRight: "40px" }}
              disabled={loading}
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#666",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="link-text">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;