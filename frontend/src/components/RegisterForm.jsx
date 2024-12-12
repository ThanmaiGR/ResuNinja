import React, { useState } from 'react';
import '../styles/RegisterForm.css';
import {Link} from "react-router-dom";
import axios from "axios"
import {useNavigate} from "react-router-dom";
import {useUser} from "../context/UserContext";

const RegisterForm = () => {
    const { setUser } = useUser();

    const [errorform, setErrorform] = useState({
        username: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

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
            url: 'http://localhost:8000/auth/register/',
            withCredentials: true,
            data: formData,
        }).then(response => {
            console.log(response.data);
            localStorage.setItem('username', response.data.username)
            setUser({ username: response.data.username });

        }).then(response => {
            navigate('/')
        }).catch(error => {
            // console.error(error.message);
            console.log(error.response.data);
            setErrorform({
                username: error.response.data.username,
                email: error.response.data.email,
                password: error.response.data.password
            })
        });
    }

    return (
        <form onSubmit={handleSubmit} className='register-form'>
            <fieldset className='register-form-fieldset'>
                <legend className='register-form-legend'>Register</legend>
                {errorform.username && <p>{errorform.username}</p>}
                <label className='register-form-label'>Username</label>
                <input className='register-form-input'
                       type="text"
                       name="username"
                       value={formData.username}
                       onChange={handleChange}
                       placeholder="Username"
                />
                {errorform.email && <p>{errorform.email}</p>}
                <label className='register-form-label'>Email</label>
                <input className='register-form-input'
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="Email"
                />
                {errorform.password && <p>{errorform.password}</p>}
                <label className='register-form-label'>Password</label>
                <input className='register-form-input'
                       type="password"
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       placeholder="Password"
                />
                <button type="submit" className='register-form-button'>Register</button>
                <p className='register-form-p'>
                    If you are a user, click here to <Link to="/login" className="register-form-link">login</Link>
                </p>
            </fieldset>
        </form>
    );
}

export default RegisterForm;