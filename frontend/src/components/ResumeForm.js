import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ResumeForm.css';
import useRequest from '../routes/UseRequest';
const ResumeForm = () => {
    const sendRequest = useRequest();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [skills, setSkills] = useState([]);
    const [input, setInput] = useState('');
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Get the first file selected by the user
    };

    const handleSkillsChange = (e) => {
        e.preventDefault();
        if(e.key === 'Enter')
            setSkills([...skills, e.target.value]); // Get the skills input value
    };
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("No file selected.");
            return;
        }
        const formData = new FormData();
        formData.append("resume_file", file);
        try {
            const response = await sendRequest('POST', 'http://localhost:8000/api/upload-resume/', formData, )
            setSkills(response.skills);
            setError(null);
        } catch (err) {
            console.error("Resume upload error:", err);
            setError("Failed to upload resume. Please try again.");
        }

    }

    useEffect( () => {
        const fetchSkills = async () => {
            try {
                const response = await sendRequest('GET', 'http://localhost:8000/api/user-skills/');
                setSkills(response.skills);
            } catch (err) {
                console.error("Skills fetch error:", err);
                setError("Failed to fetch skills. Please try again.");
            }
        };
        fetchSkills();
    }, [skills.length]);


        const handleSkillsUpload = async (e) => {
            try {
                e.preventDefault()
                const skill = input
                const response = await sendRequest('PUT', 'http://localhost:8000/api/add-skill/', {skill});
                setSkills([...skills, input]);
                setInput('');

            }catch (err) {
                console.error("Skills update error:", err);
            }
        }
        return (
            <b className='resume-form-div'>
                <form onSubmit={handleFileUpload} className="resume-form">
                    <fieldset className="resume-form-fieldset">
                        <legend className="resume-form-legend">Upload Resume</legend>
                        {error && <p>{error}</p>}
                        <label className="resume-form-label"></label>
                        <input

                            className="resume-form-input"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <button type="submit" className="resume-form-button">Upload</button>
                    </fieldset>
                </form>

                {/*<form onSubmit={handleSkills} className="resume-form">*/}
                <form className="resume-form">
                    <fieldset className="resume-form-fieldset">
                        <legend className="resume-form-legend">Your Skills</legend>
                        <label className="resume-form-label">Skills</label>
                        <input
                            className="resume-form-input"
                            type="text"
                            value = {input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Add skill"
                        />
                        <ul className="resume-form-ul">
                            {skills && skills.map((skill, index) => (
                                <li key={index} className="resume-form-li">{skill}</li>
                            ))}
                        </ul>
                        {/*<button type="submit" className="resume-form-button">Add Skills</button>*/}
                        <button onClick={handleSkillsUpload} className="resume-form-button">Add Skills</button>
                    </fieldset>
                </form>

            </b>
        );
}

export default ResumeForm;
