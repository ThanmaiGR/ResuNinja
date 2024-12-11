import React, {useState, useEffect} from 'react'
import axios from "axios";
import { ImSad  } from "react-icons/im";
import "../styles/Feedback.css"
import useRequest from "../routes/UseRequest";
const Feedback = () => {
    const sendRequest = useRequest();
    const [feedback, setFeedback] = useState([]);
    const [dates, setDates] = useState([])
    useEffect( () => {

        const fetchData = async () => {
            try {
                const response = await sendRequest('get', 'http://localhost:8000/api/get-feedback/')
                // console.log(response)
                setFeedback(response.feedbacks)
                setDates(response.dates)
            } catch (e) {
                console.log(e)
            }
        }
        const promise = fetchData()
        console.log(promise)
        console.log("feedback", feedback)
    }, [])


    return (
        <div className='body'>
            <h2>FeedBacks of {localStorage.getItem('username')}</h2>
            {
                feedback.length === 0 ?
                <p><ImSad /> No Feedbacks</p> :
                <ul className="container">
                    {
                        feedback.map(
                            (feed, index) => <li key={index} className='card'>
                                <h2 className='card-date'>Generated at {dates[index]}</h2>
                                <hr/>
                                <h3 className='card-headers'>General Feedback</h3>
                                <p className='card-p'>{feed.general_feedback} </p>
                                <h4 className='card-headers'>Strengths</h4>
                                <p className='card-p'>{feed.strengths} </p>
                                <h4 className='card-headers'>Recommendations</h4>
                                <p className='card-p'>{feed.recommendations} </p>
                            </li>
                        )
                    }
                </ul>
            }
        </div>
    )

}
export default Feedback