import React, { useState } from "react";
import "./Register.css";
import {Link, useNavigate} from "react-router-dom"
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3010/createUser",{
      method:"post",
      body:JSON.stringify(formData),
      headers:{
        "Content-Type":"application/json"
      }
    })
    const result = await response.json()
    alert(result.message)
    if(response.status===201){
      console.log(result.data);
      navigate("/login")
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" >
        <h2 className="form-title">Create Your Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          required
        />

        <button type="submit" onClick={handleSubmit}>Register</button>
        <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
