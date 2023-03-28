import Webcam from "react-webcam";
import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";
import "../WebcamCapture.css";
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
                  setEmployees(data);
                },
                (error) => {
                  console.log("Error");
                }
              );

            //Formatting time,date,month for posting
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

              let  shiftEndTime;
              let shiftName;
              let shift;

            // / /Determine the shift based on the login time
            if (logout >= Myconstants.shift1.start && logout < Myconstants.shift1.end) {
              shift = 1;
              shiftName = Myconstants.shift1Name;
              shiftEndTime = Myconstants.shift1.end;
            } else if (logout >= Myconstants.shift2.start && logout < Myconstants.shift2.end) {
              shift = 2;
              shiftName = Myconstants.shift2Name;
              shiftEndTime = Myconstants.shift2.end;
            } else {
              shift = 3;
              shiftName = Myconstants.shift3Name;
              shiftEndTime = Myconstants.shift3.end;
            }
            
            // Calculate the early logout time for the shift
            const logoutTime = moment().set({'hour': logout.split(':')[0], 'minute': logout.split(':')[1]});
            const shiftEndTimeDate = moment().set({'hour': shiftEndTime.split(':')[0], 'minute': shiftEndTime.split(':')[1]});
            
            const diffMs = shiftEndTimeDate.diff(logoutTime);
            const diffDuration = moment.duration(diffMs);
            
            const hours = diffDuration.hours().toString().padStart(2, '0');
            const minutes = diffDuration.minutes().toString().padStart(2, '0');
            const seconds = diffDuration.seconds().toString().padStart(2, '0');
            
            const earlyLogout = `${hours}:${minutes}:${seconds}`;
            console.log("earlyLogout", earlyLogout);
                          

            //Updating logout information of employee to db using the above data
            const empLogoutResultSet = fetch("http://127.0.0.1:7000/attendance/admincalendarlogout", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: empId[1],
                name: nameOfLoggedInEmp,
                end: logouttime,
                date: date,
                earlyLogout:earlyLogout
              }),
            })
              .then((empLogoutResultSet) => {
                //Logout successfull message from constant file
                if (empLogoutResultSet.status === 200) {
                  setMessage(Myconstants.Webcamlogout);
                } else {
                  setMessage(Myconstants.Webcamnotlogin);
                }
              })
          });
        })
        .catch(function (error) {
        });
    });
  }, [webcamRef, setImgSrc]);

  //Function for done icon to reload window 
  //after getting logout information of an employee saved to db
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

      <button className="Out" onClick={() => { capture(); handleClick(); }}>
        <i class="bi bi-camera2">CheckOut</i>
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
          {logout && <p style={{ fontWeight: "bold", marginLeft: "30px" }}>Logouttime: {logout}</p>}
          <br />
        </div>
        <div className="message" style={{ marginLeft: "30px", marginTop: "10px" }}>{message ? <p>{message}</p> : null}</div>
        <div className="col-lg" style={{ marginLeft: "80px", marginTop: "10px" }}>
          <button className="btn btn-outline-success" onClick={() => { refreshPage(); }} variant="danger" type="submit" block>
            <i class="bi bi-check-circle"> Done</i>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export default WebcamCaptureLogout;
