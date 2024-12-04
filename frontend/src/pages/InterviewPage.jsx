import React, { useEffect, useState } from "react";
import InterviewForm from "../components/InterviewForm";
import UseRequest from "../routes/UseRequest";
import {useNavigate} from "react-router-dom";
const InterviewPage = () => {
    const navigate = useNavigate();
    const sendRequest = UseRequest();
    const [allSkills, setAllSkills] = useState([]); // All retrieved skills
    const [skills, setSkills] = useState([]); // Selected skills (max 5)
    const [currentSkill, setCurrentSkill] = useState(0);
    const [hasStarted, setHasStarted] = useState(false); // To control when to start the interview

    useEffect(() => {
        const getSkills = async (method, url) => {
            try {
                const data = await sendRequest(method, url);
                if (data.skills) {
                    setAllSkills(data.skills);
                    // Auto-select skills if less than 5
                    setSkills(data.skills.length <= 5 ? data.skills : []);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        getSkills("GET", "http://localhost:8000/api/user-skills/");
    }, []);

    const handleSkillSelection = (skill) => {
        setSkills((prevSkills) => {
            if (prevSkills.includes(skill)) {
                // Remove skill if already selected
                return prevSkills.filter((s) => s !== skill);
            } else if (prevSkills.length < 5) {
                // Add skill if not already selected and limit not reached
                return [...prevSkills, skill];
            }
            return prevSkills; // Do nothing if limit is reached
        });
    };

    const handleCompleteSkill = (data) => {
        console.log(`Answers for ${skills[currentSkill]}:`, data);
        try{
            const feedback = sendRequest("POST", "http://localhost:8000/api/generate-feedback/", {skill: skills[currentSkill], answers: data.answers});
            console.log(feedback);
        } catch (error) {
            console.error("Error:", error);
        }
        if (currentSkill === skills.length - 1) {
            console.log("Interview process completed for all skills!");
            setCurrentSkill(0); // Reset to the first skill if needed
            setHasStarted(false); // Reset the state for a new interview
        } else {
            setCurrentSkill(currentSkill + 1); // Move to the next skill
        }
    };

    const handleStartInterview = () => {
        if (skills.length > 0) {
            setHasStarted(true);
        } else {
            alert("Please select at least one skill to start the interview.");
        }
    };

    if (!hasStarted && allSkills.length === 0) {
        navigate("/resume"); // Redirect to the resume page if no skills are available
    }
    return (
        <>
            {!hasStarted ? (
                <div>
                    <h3>Select up to 5 skills:</h3>
                    <ul>
                        {allSkills.map((skill) => (
                            <li key={skill}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={skills.includes(skill)}
                                        onChange={() => handleSkillSelection(skill)}
                                    />
                                    {skill}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleStartInterview}
                        disabled={skills.length === 0}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            background: skills.length > 0 ? "blue" : "gray",
                            color: "white",
                            border: "none",
                            cursor: skills.length > 0 ? "pointer" : "not-allowed",
                        }}
                    >
                        Start Interview
                    </button>
                </div>
            ) : (
                <InterviewForm
                    skill={skills[currentSkill]}
                    onComplete={handleCompleteSkill}
                />
            )}
        </>
    );
};

export default InterviewPage;
