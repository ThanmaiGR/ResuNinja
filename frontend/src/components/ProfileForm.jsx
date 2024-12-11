import { useNavigate } from 'react-router-dom';
import '../styles/ProfileForm.css'
import React, {useState, useEffect} from 'react';
import { useAlert } from '../context/AlertContext';
import useRequest from "../routes/UseRequest";
import axios from 'axios';
const ProfileForm = (props) => {
    const sendRequest = useRequest();
    const [user, setUser] =  useState( {
        username: '',
        name: '',
        email: '',
        phone_number: '',
        country: '',
    })
    const navigate = useNavigate();
    const { addAlert } = useAlert();

    const handleAlerts = (alert) => {
        addAlert(alert);
    };
    function viewFeedback(){
        // navigate(`/profile/${user.username}/feedback`, {state: {'feedback' : user.feedback}});
        navigate(`/profile/${props.profile.username}/feedback`, {state: {'user' : user}});

    }

    function handleChange(e) {
        setUser(prevData => {
            return {
                ...prevData,
                [e.target.name]: e.target.value
            }
        })
    }

    async function saveChanges(e) {
        try{
            e.preventDefault();
            console.log("UPDATING USER DETAILS", user)
            await sendRequest(
                'PUT',
                `http://localhost:8000/api/profile/`,
                {
                    name: user.name,
                    phone_number: user.phone_number,
                    country: user.country,
                    email: user.email,
                })
            addAlert("User details updated successfully", "success")
        }catch (e)
        {
            addAlert(e.message, "error")
        }
    }
    useEffect(() => {
    if (props.profile) {
        setUser({
            username: props.profile.username || '',
            name: props.profile.name || '',
            email: props.profile.email || '',
            phone_number: props.profile.phone_number || '',
            country: props.profile.country || '',
        });
    }
}, [props.profile]);

    return(
        <b className='profile-form-div'>
            <h2>User Details of {props.profile.username}</h2>

            <form className='profile-form' onSubmit={saveChanges}>
                <label>Name: </label>
                <input
                    type="text"
                    value={user.name}
                    className='input-box'
                    onChange={handleChange}
                    name="name"
                /><br/>
                <label>Username: </label>
                <input
                    type="text"
                    value={user.username}
                    disabled
                    className='input-box'
                    onChange={handleChange}
                    name="username"
                /><br/>
                <label>Email: </label>
                <input
                    type="email"
                    value={user.email}
                    disabled
                    className='input-box'
                    onChange={handleChange}
                    name="email"
                /><br/>
                <label>Contact: </label>
                <input
                    type="text"
                    value={user.phone_number}
                    className='input-box'
                    onChange={handleChange}
                    name="phone_number"
                /><br/>
                <label>Country: </label>
                <input
                    type="text"
                    value={user.country}
                    className='input-box'
                    onChange={handleChange}
                    name="country"
                /><br/>

                <button className="state--value">
                    Save Changes
                </button>
            </form>
            <button onClick={viewFeedback} className='feedback-button'>View FeedBacks >></button>
        </b>
    )
}

export default ProfileForm;