import {React, useState}  from "react";

const ResumeForm = () => {
    const [resume, setResume] = useState(null);

    const handleResumeChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("resume", resume);
        try {
            const response = await fetch("http://localhost:8000/api/resume/", {
                method: "POST",
                body: formData,
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Upload Resume</h1>
            <form onSubmit={handleResumeUpload}>
                <input type="file" name="resume" onChange={handleResumeChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default ResumeForm;