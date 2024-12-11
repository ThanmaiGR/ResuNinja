import Feedback from "../components/Feedback.jsx"
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import {useUser} from "../context/UserContext";
export default  function FeedbackPage() {
    const location = useLocation();
  const { user } = useUser();
    return (
        <>
            <Feedback />
            <Link to={`/profile/${user.username}/`}>Back to Profile</Link>
        </>
    )
}
