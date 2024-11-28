import React, {useState} from 'react'
import UseRequest from "../routes/UseRequest";

const Testcount = () => {
    const [data, SetData] = useState()
    const [error, setError] = useState(null);
    const sendRequest = UseRequest();
        const handleClick = async (method, url) => {

        try {
            const data = await sendRequest(method, url);
            console.log(data);
            SetData(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch data');
        }
    };
    return (
        <>
            {data && <h1>{data.counter}</h1>}
            <button onClick={() => {
                handleClick('GET', 'http://localhost:8000/api/counter/',)
            }}>Get Count
            </button>
            <button onClick={() => {
                handleClick('POST', 'http://localhost:8000/api/counter/',)
            }}>Incr Count
            </button>

        </>
    )

}

export default Testcount