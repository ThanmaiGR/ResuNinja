import LoginForm from "../components/LoginForm";
import { useUser } from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import { useAlert } from '../context/AlertContext';

export default function Login(){
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
            <LoginForm />
    )
}