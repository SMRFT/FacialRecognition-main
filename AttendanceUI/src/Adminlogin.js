import './Admin.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './Components/NavbarComp';
import profile from "./images/smrft.png";
import logo from "./images/smrft_logo.png";

import { lightGreen, red } from '@material-ui/core/colors';
function Adminlogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:7000/attendance/adminlog',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            });

        const content = await response.json();

        console.log(content)

        console.log("response:", +response.status)

        if (response.status === 200) {
            setMessage("Logged in successfully");
        } else {
            setMessage("Email or Password is incorrect");
        }

        if (content.jwt) {
            setRedirect(true);
        }
    }

    if (redirect) {
        navigate('/Admin');
    }

    return (
        <div>
            <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
            <div className='main'></div>
            <div className='logo'>
                <img src={profile} className="smrft_logo" alt="logo" />
            </div>
            <div class="screen-1">
                <img src={logo} className="logo1" alt="logo" />
                <form onSubmit={submit}>
                    <div style={{ color: 'green', font: "caption", fontStyle: "Times", fontFamily: "-moz-initial", fontSize: "40px", textAlign: "center" }}>Admin Login</div>
                    <br />
                    <div className='col-sm'>
                        <div className="row d-flex justify-content-center">
                            <input type={"email"} className="form-input" placeholder='Email address' required
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <br />

                        <div className="row d-flex justify-content-center">
                            <input type={"password"} className="form-input" placeholder='Password' required
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <br />
                        <div className="col text-center">
                            <button class="button-78" role="button" type="submit">Sign in</button>
                            <br />
                            <br />
                            <div style={{ color: "red" }} className="message">{message ? <p>{message}</p> : null}</div>
                        </div>

                    </div>

                </form>
            </div>
        </div>
    );
}
export default Adminlogin;