import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LoginForm.css';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useUser} from "../context/UserContext";
const LoginForm = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState(null)
    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.request({
            method: 'POST',
            url: 'http://localhost:8000/auth/login/',
            data: formData,
        }).then(response => {
            console.log(response.data);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('username', response.data.username)
            setUser({ username: response.data.username });
        }).then(response => {
            navigate('/')
        }).catch(error => {
            setError('Invalid Username or Password',)
        });
    }

  return (
    <form onSubmit={handleSubmit} className='login-form'>
        <fieldset className='login-form-fieldset'>
            <legend className='login-form-legend'>Login</legend>
            {error && <p>{error}</p>}
            <label className={'login-form-label'}>Username</label>
            <input className='login-form-input'
                   type="text"
                   value={formData.username}
                   name="username"
                   placeholder="Username"
                   onChange={handleChange}
            />
            <label className='login-form-label'>Password</label>
            <input className='login-form-input'
                   type="password"
                   value={formData.password}
                   name="password"
                   placeholder="Password"
                   onChange={handleChange}
            />
            <button type="submit" className='login-form-button'>login</button>
            <p className='register-form-p'>
                New user? Click here to <Link to="/signup" className="register-form-link">register</Link>
            </p>
        </fieldset>
    </form>
  )
}

export default LoginForm;