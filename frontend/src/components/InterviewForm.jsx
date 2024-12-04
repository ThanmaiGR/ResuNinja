import React, { useEffect, useState } from "react";
import "../styles/InterviewForm.css";
import UseRequest from "../routes/UseRequest";
const InterviewForm = (props) => {
    const sendRequest = UseRequest();
    const [data, SetData] = useState({
        questions: [],
        ratings: [],
        answers: []
    });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isAnswered, setIsAnswered] = useState(true);


    const fetchQuestions = async (skill) => {
        try {
            const response = await sendRequest("POST", `http://localhost:8000/api/generate-questionnaire/`, {skill});
            const { questionnaire } = response;

            // Transform the questionnaire to extract questions and ratings
            const questions = questionnaire.map(item => item.question);
            const ratings = questionnaire.map(item => item.complexity);

            // Update the state with the extracted data
            SetData({
                questions: questions || [], // Extracted questions
                ratings: ratings || [],     // Extracted ratings (complexities)
                answers: questions?.map(() => '') || [] // Initialize answers as an array of empty strings
            });
        } catch (error) {
            console.error("Questions fetch error:", error);
        }
    }


    useEffect(() => {
        // Reset questions and answers when skill changes
        SetData({
            questions: [],
            answers: []
        });
        setCurrentQuestion(0);
        setIsAnswered(true);
        // Fetch new questions when the component mounts or skill changes
        fetchQuestions(props.skill);
        setCurrentQuestion(0); // Reset to the first question
    }, [props.skill]);

    const handleNextQuestion = (e) => {
        e.preventDefault();
        if (!data.answers[currentQuestion]) {
            setIsAnswered(false);
            return;
        }
        if (currentQuestion === data.questions.length - 1) {
            setIsAnswered(true);

            // Call the parent's function to handle the completion of the interview'
            props.onComplete(data);
        } else {
            setIsAnswered(true);
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        SetData((prevData) => {
            const newAnswers = [...prevData.answers];
            newAnswers[currentQuestion] = value;
            return {
                ...prevData,
                answers: newAnswers
            };
        });
    };

    return (
        <form onSubmit={handleNextQuestion} className="interview-form">
            <fieldset className="interview-form-fieldset">
                <legend className="interview-form-legend">{props.skill}</legend>
                <label className="interview-form-label">
                    {data.questions[currentQuestion]}
                </label>
                <br />
                {!isAnswered && <span className="interview-form-error">Please provide an answer</span>}
                <textarea
                    name="answers"
                    value={data.answers[currentQuestion] || ""}
                    className="interview-form-textarea"
                    onChange={handleChange}
                />

                <button type="submit" className="interview-form-button">
                    {currentQuestion === data.questions.length - 1 ? "Finish" : "Next"}
                </button>
            </fieldset>
        </form>
    );
};

export default InterviewForm;