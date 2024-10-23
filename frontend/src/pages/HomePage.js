// src/pages/HomePage.js
import {useAlert} from "../context/AlertContext";

const HomePage = () => {
    const { addAlert } = useAlert();

    // addAlert("Welcome to the Home Page");
    return (
        <h1>Welcome to the Home Page</h1>
    )
}
export default HomePage;
