import { ImSad  } from "react-icons/im";
import "../styles/Feedback.css"
export default  function feedback(props) {
    return (
        <div className="container">
            <h2 className='title-feedbacks'>FeedBacks</h2>
            {
                props.feedback.length === 0 ?
                <p><ImSad /> No Feedbacks</p> :
                <ul className="list-container">
                    {
                        props.feedback.map(
                            (feed, index) =>
                            <li key={index} className='card'>
                                <p className="title">{index + 1}</p>
                                <p className="content">{feed}</p>
                            </li>
                        )
                    }
                </ul>
            }
        </div>
    )
}
