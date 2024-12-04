import React, { useEffect, useState } from "react";
import "../styles/InterviewForm.css";
const InterviewForm = (props) => {
    const [data, SetData] = useState({
        questions: ['Question 1', 'Question 2', 'Question 3'], // Initial static questions
        answers: []
    });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isAnswered, setIsAnswered] = useState(true);
    useEffect(() => {
        // Reset questions and answers when skill changes
        SetData({
            questions: [
                `Question 1 for ${props.skill}`,
                `Question 2 for ${props.skill}`,
                `Question 3 for ${props.skill}`
            ],
            answers: [] // Clear answers
        });
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
            // console.log("Final Data:", data);

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
