import Feedback from "../components/Feedback.js"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
export default  function FeedbackPage() {
    const location = useLocation();
    const feedback = location.state?.user.feedback || []; // Handle missing state gracefully
    const username = location.state?.user.username || '';
    return (
        <>
            <Feedback feedback={feedback} />
            <Link to={`/profile/${username}/`}>Back to Profile</Link>
        </>
    )
}
