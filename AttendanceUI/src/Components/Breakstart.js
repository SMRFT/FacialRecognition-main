import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
//import { ReactDOM } from "react";
import "../WebcamCapture.css";
import Myconstants from "../Components/Myconstants";
import { Navigate, useNavigate } from "react-router-dom";
import "../Admin";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { render } from "react-dom";
import { propTypes } from "react-bootstrap/esm/Image";
import { FilterTiltShift } from "@material-ui/icons";

const WebcamCaptureLogin = () => {
    const webcamRef = React.useRef(null);
    const [imgSrc, setImgSrc] = React.useState(null);
    const [error, setError] = useState(null);
    const [employee, setEmployees] = useState([]);
    const [isShown, setIsShown] = useState(true);
    const [message, setMessage] = useState("");
    const [loggedIn, setLoggedIn] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [duration, setDuration] = useState(null);
    let [login, setLogin] = useState();
    const handleClick = (event) => {
        setIsShown((current) => !current);

    };





    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        toDataURL(imageSrc).then((dataUrl) => {
            var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
            let formData = new FormData();
            formData.append("file", fileData);
            formData.append("file", imageSrc);
            const recognize = fetch(
                "http://localhost:8000/api/v1/recognition/recognize",
                {
                    method: "POST",
                    headers: {
                        "x-api-key": "6b447d65-7b43-4e94-ada9-cf54e57bdf16",
                    },
                    body: formData,
                }
            )
                .then((r) => r.json())
                .then(function (data) {
                    var nameEmp = data.result.map(function (recognizedEmp) {
                        const nameOfLoggedInEmp = recognizedEmp.subjects[0].subject;
                        const empId = nameOfLoggedInEmp.split("_");

                        const res = fetch("http://127.0.0.1:7000/attendance/showempById", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: empId[1] }),
                        })
                            .then((res) => res.json())
                            .then(
                                (data) => {
                                    setEmployees(data);
                                },
                                (error) => {
                                    console.log("Error");
                                }
                            );
                        ////employee time format change
                        const Emplogin = fileData.lastModifiedDate;
                        let logintime = moment(Emplogin)
                        logintime = moment(logintime).format('YYYY-MM-DD hh:mm a')
                        let log = moment(Emplogin)
                        let login = log.format('hh:mm a')
                        setLogin(login)
                        let date = log.format('YYYY-MM-DD')
                        let month = moment(logintime).format('MM')
                        let iddate = empId[1] + date



                        ////employee shift time

                        let shift;
                        if (login >= Myconstants.shift1time && login < Myconstants.shift2time) {
                            shift = (Myconstants.shift1)
                        }
                        else if (login >= Myconstants.shift3time && login < Myconstants.shift4time) {
                            shift = (Myconstants.shift2)
                        }
                        else { shift = Myconstants.shift3 }

                        let takentime = '0'
                        const empLoginResultSet = fetch(
                            "http://127.0.0.1:7000/attendance/lunchhourslogin",
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id: empId[1],
                                    name: nameOfLoggedInEmp,
                                    lunchstart: logintime,
                                    lunchEnd: logintime,
                                    iddate: iddate,
                                    date: date,
                                    Breakhour: takentime


                                }),
                            })

                            .then((empLoginResultSet) => {
                                if (empLoginResultSet.status === 200) {
                                    setMessage(Myconstants.lunchlogout);
                                } else {
                                    setMessage(Myconstants.lunchalreadylogout);
                                }

                            })
                    });
                })
                .catch(function (error) {

                });
        });
    }, [webcamRef, setImgSrc]);

    function refreshPage() {
        {
            window.location.reload();
        }
    }

    //converting "image source" (url) to "Base64"

    const toDataURL = (url) =>
        fetch(url)
            .then((response) => response.blob())
            .then(
                (blob) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );

    //converting "Base64" to javascript "File Object"
    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename);
    }

    return (
        <React.Fragment>
            <div>
                <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
                <div className='main'></div>
                <div className='logo'>
                    <img src={profile} className="smrft_logo" alt="logo" />
                </div>
            </div>

            <Navbar style={{ width: '500px', marginLeft: '250px', marginTop: '-90px' }}>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mr-auto my-2 my-lg"
                        style={{ marginLeft: '100px' }}
                        navbarScroll>
                        <Nav.Link as={Link} to="/Break" >
                            <div style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Break</div></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="container" >
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
            </div>

            <button style={{ marginLeft: "250px", marginTop: "-100px", borderColor: "#b9adad", blockSize: "50px", inlineSize: "100px" }} className="In" onClick={() => { capture(); handleClick(); }}>
                <i>Lunch Out</i>
            </button>

            <div style={{ color: "red", fontSize: "18px", marginLeft: "900px", marginTop: "200px" }} className="message">{message ? <p>{message}</p> : null}</div>

            {imgSrc && (
                <img
                    // class="container1"
                    class="rounded-border-gradient1"
                    style={{ height: "200px", width: "300px", marginTop: "-2300px", marginLeft: "850px" }}
                    src={imgSrc}
                    alt="capture"
                />
            )}

            <div
                // className="empdetails"
                style={{ display: isShown ? "none" : "block" }}
            >
                <div class="rounded-border-gradient1" style={{ marginLeft: "850px", marginTop: "-1050px", fontSize: "20px", width: "300px" }}>
                    <br />
                    {employee.id && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>ID: {employee.id}</p>}
                    {employee.name && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Name: {employee.name}</p>}
                    {employee.designation && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Designation: {employee.designation}</p>}
                    {login && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Logout time: {login}</p>}
                    <br />

                </div>

                <div className="col-lg" style={{ marginLeft: "950px", marginTop: "100px" }}>
                    <button className="btn btn-outline-success" onClick={() => { refreshPage(); }} variant="danger" type="submit" block>
                        <i class="bi bi-check-circle"> Done</i>
                    </button>
                </div>
            </div>
        </React.Fragment >
    );
};
export default WebcamCaptureLogin;
