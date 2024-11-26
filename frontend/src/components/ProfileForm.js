import { useNavigate } from 'react-router-dom';
import '../styles/ProfileForm.css'
import axios from 'axios';
import React from 'react';
import { useAlert } from '../context/AlertContext';
const ProfileForm = () => {
    const [user, setUser] =  React.useState( {
        username: 'johndoe123',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        // password: 'password',
        contact: '123456789',
        country: 'India',
        feedback: [
            '\n' +
            '\n' +
            'Lorem ipsum dolor sit amet. Id suscipit velit quo laborum voluptatibus aut voluptatem sequi est fuga tempora eos deleniti autem non voluptatum dolores est laboriosam pariatur. Et maiores dolorem et repellat molestiae ut cumque veritatis eum fugit molestiae et omnis rerum eum obcaecati odit non omnis mollitia.\n' +
            '\n' +
            'Quo magnam itaque rem obcaecati obcaecati ut eaque quia qui rerum fugiat qui reiciendis ducimus ut quae rerum vel deserunt vitae. Est voluptatem sapiente qui voluptatum illum a vero itaque non dicta minima.\n' +
            '\n' +
            'Non velit cupiditate est quam nesciunt a veniam ipsam quo provident dolorum At quos minima est molestiae odit! Est ipsum odio in nostrum sunt in rerum atque. Ea dolorem aspernatur est dignissimos consequatur ea deserunt rerum.\n',

            'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere '
        ]
    })
    // const user = {}
    const navigate = useNavigate();

    const { addAlert } = useAlert();

    const handleAlerts = (alert) => {
        addAlert(alert);
    };
    function viewFeedback(){
        console.log(user.feedback);
        // navigate(`/profile/${user.username}/feedback`, {state: {'feedback' : user.feedback}});
        navigate(`/profile/${user.username}/feedback`, {state: {'user' : user}});

    }

    function handleChange(e) {
        setUser(prevData => {
            return {
                ...prevData,
                [e.target.name]: e.target.value
            }
        })
    }

    function saveChanges(e) {
        try{
            e.preventDefault(); // Prevent default form submission behavior
            // axios.put(process.env.SOMETHING, user)
            addAlert("User details updated successfully", "success")
            // console.log("UPDATED")
        }catch (e)
        {
            addAlert(e)
        }
    }
    return(
    <>
        <h2>User Details of {user.username}</h2>
        <form className='profile-form' onSubmit={saveChanges}>
            <label>Name: </label>
            <input
                type="text"
                value={user.name}
                className='input-box'
                onChange={handleChange}
                name="name"
            /><br/>
            <label>Username: </label>
            <input
                type="text"
                value={user.username}
                disabled
                className='input-box'
                onChange={handleChange}
                name="username"
            /><br/>
            <label>Email: </label>
            <input
                type="email"
                value={user.email}
                disabled
                className='input-box'
                onChange={handleChange}
                name="email"
            /><br/>
            <label>Contact: </label>
            <input
                type="text"
                value={user.contact}
                className='input-box'
                onChange={handleChange}
                name="contact"
            /><br/>
            <label>Country: </label>
            <input
                type="text"
                value={user.country}
                className='input-box'
                onChange={handleChange}
                name="country"
            /><br/>
            <button onClick={viewFeedback} className='feedback-button'>View FeedBacks >></button>

            <button className="state--value">
              Save Changes
            </button>
        </form>
    </>
    )
}

export default ProfileForm;