import { ImSad  } from "react-icons/im";
import "../styles/Feedback.css"
export default  function feedback(props) {
    return (
        <div>
            <h2>FeedBacks</h2>
            {
                props.feedback.length === 0 ?
                <p><ImSad /> No Feedbacks</p> :
                <ul className="container">
                    {
                        props.feedback.map(
                            (feed, index) => <li key={index} className='card'>{feed} </li>
                        )
                    }
                </ul>
            }
        </div>
    )
}
