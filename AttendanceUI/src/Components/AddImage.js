import { useState } from "react";
//import { json } from "express";
function AddImg() {
    const [subject, setsubject] = useState("");
    const [message, setMessage] = useState("");
    let handleSubmit = async (e) => {
        e.preventDefault();
        let data = { subject }
        console.log(JSON.stringify(data))
        try {
            console.log("post method")
            let res = await fetch("http://localhost:7000/attendance/det", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: subject,

                }),
            });
            let resJson = await res.json();
            if (res.status === 200) {
                setsubject("");
                setMessage("Added data to Compreface Successfully ");
            } else {
                setMessage("Some error occured");
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Enter ID to Save:</label>
                <div className="col-sm-10">
                    <input className="form-control" type="text" value={subject} placeholder="Employee ID" onChange={(e) => setsubject(e.target.value)} />
                </div>
            </div>
            <br />
            <button type="submit">Confirm Image for Verification </button>
            <div className="message">{message ? <p>{message}</p> : null}</div>

        </form>
    );
}
export default AddImg;







