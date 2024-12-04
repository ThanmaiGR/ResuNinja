import Feedback from "../components/Feedback.js"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import {useUser} from "../context/UserContext";
export default  function FeedbackPage() {
    const location = useLocation();
    const feedback = location.state?.user.feedback || []; // Handle missing state gracefully
  const { user } = useUser();
    return (
        <>
            <Feedback feedback={feedback} />
            <Link to={`/profile/${user.username}/`}>Back to Profile</Link>
        </>
    )
}
