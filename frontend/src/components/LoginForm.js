import React, { useState } from 'react';
import '../styles/LoginForm.css';
import { useAlert } from '../context/AlertContext';
import {useNavigate} from "react-router-dom";
import { useUser } from '../context/UserContext'; // Import the hook

const LoginForm = () => {
    const [form, setForm] = useState({});
    const { addAlert } = useAlert();
    const navigate = useNavigate();
    const { setUser } = useUser(); // Access setUser from context
    function handleChange(e) {
        setForm(prevData => {
            return {
                ...prevData,
                [e.target.name]: e.target.value
            }
        })
    }
 const handleLogin = async (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page

  try {
    const response = await fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form), // Assuming 'user' is { email, password }
    });

    if (!response.ok) {
      throw new Error('Invalid email or password'); // Handle login failure
    }

    const data = await response.json();
    console.log('Login successful!', data);
    addAlert('Login successful!', 'success');

    // Store tokens in localStorage
    localStorage.setItem('access_token', String(data.tokens.access));
    localStorage.setItem('refresh_token', String(data.tokens.refresh));
    localStorage.setItem('user', String(data.username));
    setUser({ username: data.username }); // Update user state
    navigate('/');

    // Optionally redirect to a protected page
    // window.location.href = "/dashboard";
  } catch (error) {
    addAlert(error.message, 'error');
    console.error('Login error:', error.message);
  }
};


  return (
    <div className="form-container">
      <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <label>Username</label>
            <input
                placeholder={"Username"}
                type="text"
                value={form.username}
                name="username"
                onChange={handleChange}
            /><br/>

            <label>Password</label>
            <input
            type="password"
            placeholder="Password"
            value={form.password}
            name="password"
            onChange={handleChange}
            /><br/>
            <button type="submit">Login</button>
        </form>
    </div>
  );
};

export default LoginForm;
