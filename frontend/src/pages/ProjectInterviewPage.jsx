import React, { useEffect, useState } from "react";
import ProjectInterviewForm from "../components/ProjectInterviewForm";
import UseRequest from "../routes/UseRequest";
import {Link} from "react-router-dom";
import InterviewForm from "../components/InterviewForm";
import {useNavigate} from "react-router-dom";
const InterviewPage = () => {
    const navigate = useNavigate();
    const sendRequest = UseRequest();
    const [projects, setProjects] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentProject, setCurrentProject] = useState(0);
    const [allProjects, setAllProjects] = useState([]); // All retrieved skills
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const getProjects = async (method, url) => {
            try {
                const data = await sendRequest(method, url);
                if (data.projects) {
                    setAllProjects(data.projects);
                    // Auto-select skills if less than 5
                    setProjects(data.projects.length <= 2 ? data.projects : []);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        getProjects("GET", "http://localhost:8000/api/user-projects/");
    }, []);

    const handleProjectSelection = (project) => {
        setProjects((prevProjects) => {
            if (prevProjects.includes(project)) {
                // Remove skill if already selected
                return prevProjects.filter((s) => s !== project);
            } else if (prevProjects.length < 2) {
                // Add skill if not already selected and limit not reached
                return [...prevProjects, project];
            }
            return prevProjects; // Do nothing if limit is reached
        });
    };

    const handleCompleteProject =  async (data) => {
        console.log(`Answers for ${projects[currentProject]}:`, data);
        try{
            setLoading(true);
            await sendRequest("POST", "http://localhost:8000/api/generate-feedback/", {title: projects[currentProject], answers: data.answers, questions: data.questions, type: "project"});
            setLoading(false);
        } catch (error) {
            console.error("Error:", error);
        }
        if (currentProject === projects.length - 1) {
            console.log("Interview process completed for all skills!");
            navigate("/project-feedback");
            // setCurrentSkill(0); // Reset to the first skill if needed
            // setHasStarted(false); // Reset the state for a new interview
        } else {
            setCurrentProject(currentProject + 1); // Move to the next skill
        }
    };

    const handleStartInterview = () => {
        if (projects.length > 0) {
            setHasStarted(true);
            localStorage.setItem("skills", JSON.stringify(projects));
        } else {
            alert("Please select at least one skill to start the interview.");
        }
    };

    if (!hasStarted && allProjects.length === 0 && !loading) {
        navigate("/resume"); // Redirect to the resume page if no skills are available
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {!hasStarted ? (
                <div>
                    <h3>Select up to 2 projects:</h3>
                    <ul>
                        {allProjects.map((project) => (
                            <li key={project}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={projects.includes(project)}
                                        onChange={() => handleProjectSelection(project)}
                                    />
                                    {project}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleStartInterview}
                        disabled={projects.length === 0}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            background: projects.length > 0 ? "blue" : "gray",
                            color: "white",
                            border: "none",
                            cursor: projects.length > 0 ? "pointer" : "not-allowed",
                        }}
                    >
                        Start Interview
                    </button>
                </div>
            ) : (
                <ProjectInterviewForm
                    project={projects[currentProject]}
                    onComplete={handleCompleteProject}
                />
            )}
        </>
    );
};

export default InterviewPage;
