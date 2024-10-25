import React, { useState } from 'react';
import '../styles/SignupForm.css';
import { useAlert } from '../context/AlertContext';
import {useNavigate} from "react-router-dom";

const SignupForm = () => {
   const [user, setUser] = useState({});
   const { addAlert } = useAlert();
   const navigate = useNavigate();

   function handleChange(e) {
       console.log(e.target.name, e.target.value)
        setUser(prevData => {
            return {
                ...prevData,
                [e.target.name]: e.target.value
            }
        })
    }
const handleSignUp = async (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page
console.log(user)
  try {
    const response = await fetch('http://localhost:8000/api/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user), // Assuming 'user' is { email, password }
    });

    if (!response.ok) {
      throw new Error('User Already Exists'); // Handle login failure
    }

    const data = await response.json();
    console.log('SignUp successful!', data);
    addAlert('SignUp successful!', 'success');

    // Store tokens in localStorage
    localStorage.setItem('access_token', data.tokens.access);
    localStorage.setItem('refresh_token', data.tokens.refresh);
    localStorage.setItem('user', data.username);
    navigate('/', {state: {'user' : user}});

    // Optionally redirect to a protected page
    // window.location.href = "/dashboard";
  } catch (error) {
    addAlert(error.message, 'error');
    console.error('Login error:', error.message);
  }
};

  return (
    <div className="form-container">
      <h2>Signup</h2>
        <form onSubmit={handleSignUp}>
            <label>Username</label><br/>
            <input
                placeholder={"Username"}
                type="text"
                value={user.username}
                name="username"
                onChange={handleChange}
            /><br/>
            <label>Email</label><br/>
            <input
                type="email"
                placeholder="Email"
                value={user.email}
                name="email"
                onChange={handleChange}
            /><br/>
            <label>Password</label><br/>
            <input
                type="password"
                placeholder="Password"
                value={user.password}
                name="password"
                onChange={handleChange}
            /><br/>
            <button type="submit">Signup</button>
        </form>
    </div>
  );
};

export default SignupForm;
