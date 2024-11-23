import SignupForm from "../components/SignupForm";
import { useUser } from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import { useAlert } from '../context/AlertContext';

export default function SignupPage(){
    const {user} = useUser();
    const navigate = useNavigate();
    const { addAlert } = useAlert();
    if (user.username !== undefined) {
        addAlert('You are already logged in!', 'info');
        return (
            navigate('/')
        )
    }
    return (
        <SignupForm />
    )
}