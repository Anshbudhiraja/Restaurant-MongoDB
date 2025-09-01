import React, { useState } from "react";
import "./Login.css";
import {Link, useNavigate} from "react-router-dom"
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
     const response = await fetch("http://localhost:3010/verifyUser",{
      method:"post",
      body:JSON.stringify(formData),
      headers:{
        "Content-Type":"application/json"
      }
    })
    const result = await response.json()
    alert(result.message)
    if(response.status===202){
      localStorage.setItem("Authorization",JSON.stringify({token:result.token}))
      navigate("/menu")
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Login to Your Account</h2>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
