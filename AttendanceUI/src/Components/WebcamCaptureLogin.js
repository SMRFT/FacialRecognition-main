//This component is to render a camera which captures screenshot of an employee 
//and matches to compreface and db and retrieves the details of an employee and 
//stores the login details of an employee to calculate the employee login information
import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
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
import axios from 'axios';
import ReactWhatsapp from 'react-whatsapp';
// import { Twilio } from 'twilio';

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
  const [email, setEmail] = useState([]);
  let [login, setLogin] = useState();

  //Function for hide and show for employee details
  const handleClick = (event) => {
    setIsShown((current) => !current);
  };

  const capture = React.useCallback(() => {
    //Function to get camera screenshot image of an employee and changing it as dataurl
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    toDataURL(imageSrc).then((dataUrl) => {
      var fileData = dataURLtoFile(dataUrl, "imageName.jpg");
      //Appending the image to formdata as dataurl format
      let formData = new FormData();
      formData.append("file", fileData);
      formData.append("file", imageSrc);
      //Posting image to compreface
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
            //Post method to show the employee details using id
            const res = fetch("http://127.0.0.1:7000/attendance/showempById", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: empId[1] }),
            })
              .then((res) => res.json())
              .then(
                (data) => {
                  const email = data.email;
                  // const phonenumber = data.mobile
                  setEmail(email);
                  // <ReactWhatsapp number="+91-7904019642" message="Hello World!!!" />
                  // console.log("email", email);
                  fetch("http://127.0.0.1:7000/attendance/send-email/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({ subject: subject, message: messages, recipient: email }),
                  })
                  fetch("http://127.0.0.1:7000/attendance/send-whatsapp/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                    },
                    body: JSON.stringify({ message: messages, to: "WhatsApp:+91" + data.mobile }),
                  })
                    .then(response => {
                    })
                    .catch(error => {
                      console.log('error', error);
                    });

                  setEmployees(data);
                },
                (error) => {
                  console.log("Error");
                }
              );

            //Formatting time,date,month for posting
            const Emplogin = fileData.lastModifiedDate;
            let logintime = moment(Emplogin)
            logintime = moment(logintime).format('YYYY-MM-DD HH:mm')
            let year = moment(logintime).format('YYYY')
            let log = moment(Emplogin)
            let login = log.format('HH:mm')
            setLogin(login)
            let date = log.format('YYYY-MM-DD')
            let month = moment(logintime).format('MM')
            let iddate = empId[1] + date

            // let lunchStart = '0'
            // console.log(data.name)

            ////employee shift time
            const subject = "Shanmuga Hospital Login Details";
            const messages = `Name: ${empId[0]},
            Employee id:${empId[1]},
            Date: ${date},
            Shift Login time: ${logintime}`;

            // const recipient = "parthipanmurugan335317@gmail.com";
            // const recipient = email
            // console.log(recipient)

            let shift;
            if (login >= Myconstants.shift1time && login < Myconstants.shift2time) {
              shift = (Myconstants.shift1)
            }
            else if (login >= Myconstants.shift3time && login < Myconstants.shift4time) {
              shift = (Myconstants.shift2)
            }
            else { shift = Myconstants.shift3 }

            //Posting login information of employee to db using the above data
            const empLoginResultSet = fetch(
              "http://127.0.0.1:7000/attendance/admincalendarlogin",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: empId[1],
                  name: nameOfLoggedInEmp,
                  start: logintime,
                  end: logintime,
                  date: date,
                  shift: shift,
                  iddate: iddate,
                  month: month,
                  month: month,
                  year: year
                }),
              })
              .then((empLoginResultSet) => {
                //Login successfull message from constant file
                if (empLoginResultSet.status === 200) {
                  setMessage(Myconstants.Webcamlogin);
                } else {
                  setMessage(Myconstants.Webcamalreadylogin);
                }

              })
          });
        })
        .catch(function (error) {
        });
    });
  }, [webcamRef, setImgSrc]);

  //Function for done icon to reload window 
  //after getting login information of an employee saved to db
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
            <Nav.Link as={Link} to="/" className='nav_link1'>Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container">
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      </div>

      <button className="In" onClick={() => { capture(); handleClick(); }}>
        <i class="bi bi-camera2"> Check In</i>
      </button>

      {imgSrc && (
        <img
          className="screenshot"
          src={imgSrc}
          alt="capture"
        />
      )}

      <div className="empdetails" style={{ display: isShown ? "none" : "block" }}>
        <div>
          <br />
          {employee.id && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>ID: {employee.id}</p>}
          {employee.name && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Name: {employee.name}</p>}
          {employee.designation && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Designation: {employee.designation}</p>}
          {login && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Logintime: {login}</p>}
          <br />
        </div>
        <div className="message" style={{ marginLeft: "30px", marginTop: "10px" }}>{message ? <p>{message}</p> : null}</div>
        <div className="col-lg" style={{ marginLeft: "80px", marginTop: "10px" }}>
          <button className="btn btn-outline-success" onClick={() => { refreshPage(); }} variant="danger" type="submit" block>
            <i className="bi bi-check-circle"> Done</i>
          </button>
        </div>
      </div>

    </React.Fragment >
  );
};

export default WebcamCaptureLogin;
