import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        // Login successful, store the token in cookies
        document.cookie = `token=${data.token}; path=/;`;
        // Login successful, redirect to dashboard
        navigate("/dashboard");
      } else {
        console.error(data.message);
        alert("User Not found or enter proper details");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleForm = () => {
    navigate("/signup");
  };

  return (
    <div className="loginForm">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <span onClick={toggleForm}>Sign up here</span>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
