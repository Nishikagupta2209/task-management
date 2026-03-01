import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { Link } from "react-router-dom";

const Rule = ({ valid, text }) => {
  return (
    <div className={`rule ${valid ? "valid" : "invalid"}`}>
      <span className="icon">{valid ? "✔" : "✖"}</span>
      <span>{text}</span>
    </div>
  );
};
export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Enter a valid email address";
    return null;
  };
  const passwordCriteria = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    noSpaces: !/\s/.test(form.password),
 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    const allValid = Object.values(passwordCriteria).every(Boolean);
    if (!allValid) newErrors.password = "Password does not meet requirements";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email: form.email,
          password: form.password,
        }
      );
      alert(res.data.message);
      window.location.href = "/login";
    } catch (err) {
      setErrors({
        general: err.response?.data?.message || "Registration failed",
      });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit} noValidate>
          
          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setPasswordTouched(true)}
              placeholder="Enter your password"
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {passwordTouched && (
              <div className="password-rules">
                <Rule valid={passwordCriteria.length} text="At least 8 characters" />
                <Rule valid={passwordCriteria.uppercase} text="One uppercase letter" />
                <Rule valid={passwordCriteria.lowercase} text="One lowercase letter" />
                <Rule valid={passwordCriteria.number} text="One number" />
                <Rule valid={passwordCriteria.special} text="One special character" />
                <Rule valid={passwordCriteria.noSpaces} text="No spaces" />
                </div>
              )}
              </div>
          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onPaste={(e) => e.preventDefault()}
                placeholder="Re-enter your password"
              />
            </div>
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          {errors.general && <span className="error">{errors.general}</span>}

          <button type="submit" className="submit-btn">
            Register
          </button>

          {/* Login Option */}
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#007bff", fontWeight: "500" }}>
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}