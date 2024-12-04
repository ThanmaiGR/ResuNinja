import React, { useState, useEffect } from 'react';
import '../styles/ResumeForm.css';
import useRequest from '../routes/UseRequest';
import { useNavigate } from 'react-router-dom';

const ResumeForm = () => {
    const navigate = useNavigate();
    const sendRequest = useRequest();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [input, setInput] = useState('');
    const [projectInput, setProjectInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSkillsChange = (e) => {
        e.preventDefault();
        if (e.key === 'Enter') setSkills([...skills, e.target.value]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("No file selected.");
            return;
        }
        const formData = new FormData();
        formData.append("resume_file", file);
        setLoading(true);
        try {
            const response = await sendRequest('POST', 'http://localhost:8000/api/upload-resume/', formData);
            setSkills(response.skills);
            setError(null);
            setLoading(false);
        } catch (err) {
            console.error("Resume upload error:", err);
            setError("Failed to upload resume. Please try again.");
        }
    };

    const interview = () => {
        navigate('/interview');
    };

    const projectinterview = () => {
        navigate('/project-interview');
    };


    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await sendRequest('GET', 'http://localhost:8000/api/user-skills/');
                setSkills(response.skills);
                // setProjects(response.projects);
            } catch (err) {
                console.error("Skills fetch error:", err);
                setError("Failed to fetch skills. Please try again.");
            }
        };
        fetchSkills();
    }, [skills.length]);

    const handleSkillsUpload = async (e) => {
        e.preventDefault();
        try {
            const skill = input;
            await sendRequest('PUT', 'http://localhost:8000/api/add-skill/', { skill });
            setSkills([...skills, input]);
            setInput('');
        } catch (err) {
            console.error("Skills update error:", err);
        }
    };

    const handleProjectUpload = async (e) => {
        e.preventDefault();
        try {
            const project = projectInput;
            await sendRequest('PUT', 'http://localhost:8000/api/add-project/', { project });
            setProjects([...projects, projectInput]);
            setProjectInput('');
        } catch (err) {
            console.error("Projects update error:", err);
        }
    };

    return (
        <div className="resume-form-div">
            <form onSubmit={handleFileUpload} className="resume-form">
                <fieldset className="resume-form-fieldset">
                    <legend className="resume-form-legend">Upload Resume</legend>
                    {error && <p>{error}</p>}
                    <input
                        className="resume-form-input"
                        type="file"
                        onChange={handleFileChange}
                    />
                    {loading ? <p>Uploading and Processing Resume...</p> : null}
                    <button type="submit" className="resume-form-button">Upload</button>
                </fieldset>
            </form>

            <form className="resume-form">
                <fieldset className="resume-form-fieldset">
                    <legend className="resume-form-legend">Your Skills</legend>
                    <input
                        className="resume-form-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Add skill"
                    />
                    <ul className="resume-form-ul">
                        {skills && skills.map((skill, index) => (
                            <li key={index} className="resume-form-li">{skill}</li>
                        ))}
                    </ul>
                    <button onClick={handleSkillsUpload} className="resume-form-button">Add Skills</button>
                    {skills.length > 0 && (
                        <button onClick={interview} className="resume-form-button">Proceed to interview</button>
                    )}
                </fieldset>
            </form>

            <form className="resume-form">
                <fieldset className="resume-form-fieldset">
                    <legend className="resume-form-legend">Your Projects</legend>
                    <input
                        className="resume-form-input"
                        type="text"
                        value={projectInput}
                        onChange={(e) => setProjectInput(e.target.value)}
                        placeholder="Add project"
                    />
                    <ul className="resume-form-ul">
                        {projects && projects.map((project, index) => (
                            <li key={index} className="resume-form-li">{project}</li>
                        ))}
                    </ul>
                    <button onClick={handleProjectUpload} className="resume-form-button">Add Project</button>
                     {projects.length > 0 && (
                        <button onClick={projectinterview} className="resume-form-button">Proceed to Project interview</button>
                    )}
                </fieldset>
            </form>
        </div>
    );
};

export default ResumeForm;
