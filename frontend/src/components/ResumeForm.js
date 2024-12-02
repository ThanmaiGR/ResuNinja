import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ResumeForm.css';
import { useNavigate } from 'react-router-dom';

const ResumeForm = () => {
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [error, setError] = useState(null);

    const handleResumeChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resume', resume);
        
        try {
            const response = await axios.post('http://localhost:8000/api/resume/', formData);
            console.log(response.data);
            navigate('/');  // Redirect after successful upload
        } catch (error) {
            setError('Failed to upload the resume.');
        }
    };

    return (
        <form onSubmit={handleResumeUpload} className="resume-form">
            <fieldset className="resume-form-fieldset">
                <legend className="resume-form-legend">Upload Resume</legend>
                {error && <p>{error}</p>}
                <label className="resume-form-label"></label>
                <input 
                    className="resume-form-input"
                    type="file"
                    onChange={handleResumeChange} 
                />
                <button type="submit" className="resume-form-button">Upload</button>
            </fieldset>
        </form>
    );
}

export default ResumeForm;
