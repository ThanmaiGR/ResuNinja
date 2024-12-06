import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const { user } = useUser();

    // Redirect to home page if user is already logged in
    useEffect(() => {
        if (user?.username) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className='login-page'>
            <LoginForm />
        </div>
    );
}