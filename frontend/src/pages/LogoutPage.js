import Logout from "../components/Logout";
import { useUser } from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import { useAlert } from '../context/AlertContext';
export default function LogoutPage() {
    const {user} = useUser();
    const navigate = useNavigate();
    const { addAlert } = useAlert();
    if (user.username === undefined) {
        addAlert('You haven\'t logged in yet', 'info');
        return (
            navigate('/login')
        )
    }
    return(
            <Logout />
    )
}