import React, {useState, useEffect} from 'react';
import UseRequest from "../routes/UseRequest";
import "../styles/InterviewFeedbackPage.css";

const InterviewFeedbackPage = () => {
    const sendRequest = UseRequest();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resp, setResp] = useState({
        overall_feedback: {
            general_feedback: "",
            quantitative: {},
            strengths: [],
            recommendations: []
        },
        all_feedback: {},
        all_skills: []
    });

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const response = await sendRequest("POST", "http://localhost:8000/api/generate-overall-feedback/", {type: "skill"});

                if (!response) {
                    setError("No feedback available");
                }

                const {overall_feedback, all_feedback, all_skills} = response;

                setResp({
                    overall_feedback: overall_feedback || {
                        general_feedback: "",
                        quantitative: {},
                        strengths: [],
                        recommendations: []
                    },
                    all_feedback: all_feedback || {},
                    all_skills: Array.isArray(all_skills) ? all_skills : []
                });
                console.log("Response", response);
                console.log("OVERALL FEEDBACK", overall_feedback);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.message || "An error occurred");
            }
        };
        fetchFeedback();
    }, []);

    if (error) {
        return <h3>{error && <p>Error fetching feedback: {error}</p>}</h3>
    }
    return (
        <b className='body'>
            <h2>{loading && <p>Loading feedback...</p>}</h2>
            {!loading && <div>
                {/* Overall Feedback */}
                <div className="overall-feedback">
                    <h3>Overall Feedback</h3>
                    {/* Displaying Descriptive Feedback */}
                    <p>{resp.overall_feedback.general_feedback || "No Overall Feedback"}</p>

                    {/* Displaying Quantitative Scores */}
                    {resp?.overall_feedback?.quantitative && Object.keys(resp.overall_feedback.quantitative).length > 0 && (
                        <div>
                            <h5>Quantitative Scores</h5>
                            <ul>
                                {Object.entries(resp.overall_feedback.quantitative).map(([metric, score], idx) => (
                                    <li key={idx}>
                                        <strong>{metric}:</strong> {score}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Displaying Strengths */}
                    {resp.overall_feedback.strengths?.length > 0 ? (
                        <div>
                            <h5>Strengths</h5>
                            <ul>
                                {resp.overall_feedback.strengths.map((strength, idx) => (
                                    <li key={idx}>{strength}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No strengths listed.</p>
                    )}

                    {/* Displaying Recommendations */}
                    {resp.overall_feedback.recommendations?.length > 0 ? (
                        <div>
                            <h5>Recommendations</h5>
                            <ul>
                                {resp.overall_feedback.recommendations.map((rec, idx) => (
                                    <li key={idx}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No recommendations available.</p>
                    )}
                </div>
                <hr/>
                {/* Feedback on Skills */}
                <div className="feedback">
                    <h3>Feedback on Skills</h3>
                    <ul>
                        {resp.all_skills.map((skill, index) => {
                            console.log(skill)
                            console.log(resp.all_feedback[skill]);
                            const skillFeedback = resp.all_feedback[skill]?.descriptive
                            const quantitativeData = resp.all_feedback[skill]?.quantitative;
                            // console.log("DESC", skillFeedback);
                            // console.log("QUANT", quantitativeData);
                            return (
                                <li key={index}>
                                    <h4>{skill}</h4>
                                    {/* Descriptive Feedback */}
                                    <p>{skillFeedback || "No feedback available for this skill."}</p>

                                    {/* Quantitative Scores */}
                                    {quantitativeData ? (
                                        <div>
                                            <h5>Quantitative Scores</h5>
                                            <ul>
                                                {Object.entries(quantitativeData).map(([metric, score], idx) => (
                                                    <li key={idx}>
                                                        <strong>{metric}:</strong> {score}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No quantitative data available for this skill.</p>
                                    )}
                                    <hr/>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            }
        </b>
    );
};

export default InterviewFeedbackPage;
