import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
//import { ReactDOM } from "react";
import "../WebcamCapture.css";
import "../Logo.css";
import Myconstants from "../Components/Myconstants";
import { useNavigate } from "react-router-dom";
import "../Admin";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { Navbar, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { render } from "react-dom";
import { propTypes } from "react-bootstrap/esm/Image";
import { LocalGroceryStore } from "@material-ui/icons";
const WebcamCaptureLogout = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [error, setError] = useState(null);
  const [employee, setEmployees] = useState([]);
  const [isShown, setIsShown] = useState(true);
  const [message, setMessage] = useState("")
  let [logout, setLogout] = useState("")
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

            const Emplogout = fileData.lastModifiedDate;


            let logouttime = moment(Emplogout)


            logouttime = moment(logouttime).format('YYYY-MM-DD HH:mm')


            let log = moment(Emplogout)


            let logout = log.format('HH:mm')
            setLogout(logout)
            // let shifttime = '2023-01-12 05:00'
            // let overtimehours = logouttime - shifttime
            // console.log(overtimehours)

            let date = log.format('YYYY-MM-DD')


            const empLogoutResultSet = fetch("http://127.0.0.1:7000/attendance/admincalendarlogout", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: empId[1],
                name: nameOfLoggedInEmp,
                end: logouttime,
                date: date
              }),
            })
              .then((empLogoutResultSet) => {
                if (empLogoutResultSet.status === 200) {
                  setMessage(Myconstants.Webcamlogout);
                } else {
                  setMessage(Myconstants.Webcamnotlogin);
                }
              })
          });
        })
        .catch(function (error) {
          // console.log("Request failed: " + JSON.stringify(error));
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
  // console.log("employee details:" + JSON.stringify(employee));

  return (
    <React.Fragment>
      <div>
        <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
        <div className='main'></div>
        <div className='logo'>
          <img src={profile} className="smrft_logo" alt="logo" />
        </div>
      </div>

      <Navbar style={{ width: '500px', marginLeft: '250px', marginTop: '-40px' }}>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="mr-auto my-2 my-lg"
            style={{ marginLeft: '100px' }}
            navbarScroll>
            <Nav.Link as={Link} to="/" >
              <div style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container">
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      </div>

      <button style={{ marginLeft: "250px", marginTop: "-100px", borderColor: "#b9adad", blockSize: "50px", inlineSize: "100px" }} className="Out" onClick={() => { capture(); handleClick(); }}>
        <i class="bi bi-camera2">CheckOut</i>
      </button>

      <div style={{ color: "red", fontSize: "18px", marginLeft: "700px", marginBottom: "100px" }} className="message">{message ? <p>{message}</p> : null}</div>

      {imgSrc && (
        <img
          className="screenshot"
          style={{ height: "150px", width: "200px", marginTop: "-900px", marginLeft: "700px" }}
          src={imgSrc}
          alt="capture"
        />
      )}


      <div
        className="empdetails"
        style={{ display: isShown ? "none" : "block" }}
      >
        <div style={{ marginLeft: "700px", marginTop: "-350px", fontSize: "20px" }}>
          <b></b>
          <br />
          {employee.id && <p>ID: {employee.id}</p>}
          {employee.name && <p>Name: {employee.name}</p>}
          {employee.designation && <p>Designation: {employee.designation}</p>}
          {logout && <p>Logouttime: {logout}</p>}
          <br />

        </div>
        <div className="col-lg" style={{ marginLeft: "760px", marginTop: "150px" }}>
          <button className="btn btn-outline-success" onClick={() => { refreshPage(); }} variant="danger" type="submit" block>
            <i class="bi bi-check-circle"> Done</i>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export default WebcamCaptureLogout;
