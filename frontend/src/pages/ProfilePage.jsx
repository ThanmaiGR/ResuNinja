import { useNavigate } from 'react-router-dom';
import { React, useState, useEffect } from "react";
import ProfileForm from "../components/ProfileForm";
import useRequest from "../routes/UseRequest";
import axios from "axios";

const ProfilePage = () => {
    const sendRequest = useRequest(); // Ensure the correct hook is imported
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleClick = async (method, url) => {
        try {
            const data = await sendRequest(method, url);
            setProfile(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch profile data');
        }
    };

    useEffect(() => {
        handleClick('GET', 'http://localhost:8000/api/profile/');
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return <ProfileForm profile={profile} />;
};

export default ProfilePage;
