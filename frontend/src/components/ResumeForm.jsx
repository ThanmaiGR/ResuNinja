import React, { useState, useEffect } from 'react';
import '../styles/ResumeForm.css';
import useRequest from '../routes/UseRequest';
import { useNavigate } from 'react-router-dom';

const ResumeForm = () => {
    const navigate = useNavigate();
    const sendRequest = useRequest();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [skillError, setSkillError] = useState(null);
    const [projectError, setProjectError] = useState(null);
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
            setProjects(response.projects.map(project =>
                project.title
            ));
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


    const handleSkillsUpload = async (e) => {
        try {
            e.preventDefault();
            const skill = input;
            await sendRequest('PUT', 'http://localhost:8000/api/add-skill/', { skill });
            setSkillError(null);
            setSkills([...skills, input]);
            setInput('');
        } catch (err) {
            setSkillError("Failed to add skill. Please try again.");
            console.error("Skills update error:", err);
        }
    };

    const handleProjectUpload = async (e) => {
        e.preventDefault();
        try {
            const project = projectInput;
            await sendRequest('PUT', 'http://localhost:8000/api/add-project/', { title: project });
            setProjects([...projects, projectInput]);
            setProjectInput('');
            setProjectError(null);
        } catch (err) {
            setProjectError("Failed to add project. Please try again.");
            console.error("Projects update error:", err);
        }
    };

    const handleDeleteSkill = async (index) => {
        try {
            const skillToDelete = skills[index];
            await sendRequest('DELETE', 'http://localhost:8000/api/add-skill/', { skill: skillToDelete });
            setSkillError(null);
            setSkills(skills.filter((_, i) => i !== index)); // Update state only after successful deletion

        } catch (err) {
            setSkillError("Failed to delete the skill. Please try again.");
            console.error("Skill deletion error:", err);
        }
    };


    const handleDeleteProject = async (index) => {
        try {
            const projectToDelete = projects[index];
            await sendRequest('DELETE', 'http://localhost:8000/api/add-project/', { title: projectToDelete });
            setProjects(projects.filter((_, i) => i !== index)); // Update state only after successful deletion
            setProjectError(null);
        } catch (err) {
            setProjectError("Failed to delete the project. Please try again.");
            console.error("Project deletion error:", err);
        }
    };


    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await sendRequest('GET', 'http://localhost:8000/api/user-skills/');
                setSkills(response.skills);
                const response2 = await sendRequest('GET', 'http://localhost:8000/api/user-projects/');
                setProjects(response2.projects);
                // setProjects(response.projects);
            } catch (err) {
                console.error("Skills fetch error:", err);
                setError("Failed to fetch skills. Please try again.");
            }
        };
        fetchSkills();
    }, [skills.length, projects.length]);

    return (
        <div className="resume-form-div">
            <div className="resume-form-header">
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
            </div>

            <div className="resume-form-header">
                <form className="resume-form" onSubmit={handleSkillsUpload}>
                    <fieldset className="resume-form-fieldset">
                        <legend className="resume-form-legend">Your Skills</legend>
                        {skillError && <p>{skillError}</p>}
                        <input
                            className="resume-form-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Add skill"
                        />
                        <ul className="resume-form-ul">
                            {skills && skills.sort().map((skill, index) => (
                                <div className='skill-div'>
                                    <li key={index} className="resume-form-li">{skill}</li>
                                    <button
                                        className="delete-skill-button"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent page reload
                                            handleDeleteSkill(index);
                                        }}
                                    >
                                        &times;
                                    </button>

                                </div>
                            ))}
                        </ul>
                    </fieldset>
                    <button type="submit" className="resume-form-button">Add Skills</button>
                {skills.length > 0 && (
                    <button onClick={interview} className="resume-form-button">Proceed to interview</button>
                        )}
                </form>
            </div>

            <div className="resume-form-header">
                <form className="resume-form" onSubmit={handleProjectUpload}>
                    <fieldset className="resume-form-fieldset">
                        <legend className="resume-form-legend">Your Projects</legend>
                        {projectError && <p>{projectError}</p>}
                        <input
                            className="resume-form-input"
                            type="text"
                            value={projectInput}
                            onChange={(e) => setProjectInput(e.target.value)}
                            placeholder="Add project"
                        />
                        <ul className="resume-form-ul">

                            {projects && projects.sort().map((project, index) => (
                                <div className='skill-div'>
                                    <li key={index} className="resume-form-li">{project}</li>
                                    <button
                                        className="delete-skill-button"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent page reload
                                            handleDeleteProject(index);
                                        }}
                                    >
                                        &times;
                                    </button>

                                </div>
                            ))}
                        </ul>
                        </fieldset>

                        <button type="submit" className="resume-form-button">Add Project</button>
                        {projects.length > 0 && (
                            <button onClick={projectinterview} className="resume-form-button">Proceed to Project interview</button>
                        )}
                </form>
            </div>
        </div>
    );
};

export default ResumeForm;
