import React, { useEffect, useState } from "react";
import ProjectInterviewForm from "../components/ProjectInterviewForm";
import UseRequest from "../routes/UseRequest";
import {Link} from "react-router-dom";
const InterviewPage = () => {
    const sendRequest = UseRequest();
    const [projects, setProjects] = useState(['project1', 'project2', 'project3']);

    const [currentProject, setCurrentProject] = useState(0);

    useEffect(() => {
        const getProjects = async (method, url) => {
            try {
                const data = await sendRequest(method, url);
                setProjects(data.projects);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        getProjects("GET", "http://localhost:8000/api/user-projects/");
    }, []);


    const handleCompleteSkill = (data) => {
        console.log(`Answers for ${projects[currentProject]}:`, data);
        // try{
        //     const feedback = sendRequest("POST", "http://localhost:8000/api/generate-feedback-project/", {skill: projects[currentProject], answers: data.answers});
        //     console.log(feedback);
        // } catch (error) {
        //     console.error("Error:", error);
        // }
        if (currentProject === projects.length - 1) {
            console.log("Interview process completed for all projects!");
            setCurrentProject(0); // Reset to the first project if needed
        } else {
            setCurrentProject(currentProject + 1); // Move to the next skill
        }
    };

    if (projects.length === 0) {
        return (
            <>
                <h1>No projects found</h1>
                <Link to="/resume">Upload resume</Link>
            </>
        )
    }
    else {
        return (
            <>
                {
                    projects.length > 0 && (
                        <ProjectInterviewForm
                            project={projects[currentProject]}
                            onComplete={handleCompleteSkill}
                        />
                    )
                }
            </>
        );
    }
};

export default InterviewPage;
