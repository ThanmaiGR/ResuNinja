import React, { useState } from "react";
import InterviewForm from "../components/InterviewForm";

const InterviewPage = () => {
    const [skills, setSkills] = useState(['Skill1', 'Skill2', 'Skill3']);
    const [currentSkill, setCurrentSkill] = useState(0);

    const handleCompleteSkill = (data) => {
        console.log(`Answers for ${skills[currentSkill]}:`, data);

        if (currentSkill === skills.length - 1) {
            console.log("Interview process completed for all skills!");
            setCurrentSkill(0); // Reset to the first skill if needed
        } else {
            setCurrentSkill(currentSkill + 1); // Move to the next skill
        }
    };

    // useEffect(() => {
    //     const getSkills = async (method, url) => {
    //         try {
    //             const data = await sendRequest(method, url);
    //             if (data.skills)
    //                 setSkills(data.skills);
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     };
    //     getSkills('GET', 'http://localhost:8000/api/skills/');
    // }, []);

    return (
        <>
            <InterviewForm
                skill={skills[currentSkill]}
                onComplete={handleCompleteSkill}
            />
        </>
    );
};

export default InterviewPage;
