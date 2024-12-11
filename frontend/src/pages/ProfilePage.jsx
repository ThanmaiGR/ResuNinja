import { useNavigate } from 'react-router-dom';
import { React, useState, useEffect } from "react";
import ProfileForm from "../components/ProfileForm";
import useRequest from "../routes/UseRequest";

const ProfilePage = () => {
    const sendRequest = useRequest(); // Ensure the correct hook is imported
    const [profile, setProfile] = useState(null); // Start with `null` to represent loading state
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const data = await sendRequest('GET', 'http://localhost:8000/api/profile/');
            setProfile(data); // Directly set the response object if structure matches
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to fetch profile data');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (profile === null) { // Explicitly check for loading state
        return <div>Loading...</div>;
    }

    return <ProfileForm profile={profile} />;
};

export default ProfilePage;
