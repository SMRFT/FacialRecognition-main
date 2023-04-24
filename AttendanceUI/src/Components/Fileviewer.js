import { useState } from 'react';
import axios from 'axios';
import React, { useEffect } from "react";
import "./Fileviewer.css";
import "./NavbarComp.css";
import Footer from './Footer';
// import "../Logo.css";
// import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Navbar, Nav } from "react-bootstrap";
import profile from "../images/smrft.png";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
function DownloadButton(props) {
    // Set up state variables
    const [isLoading, setIsLoading] = useState(false);
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [message, setMessage] = useState("");
    // const [clicked, setClicked] = useState("");

    // Get the name parameter from the URL
    const params = useParams();
    const name = params.name;
    const sub = name.split('_');
    const id = sub[1]
    const name1 = sub[0]

    // Close the iframe when the Close button is clicked
    const closeIframe = () => {
        setIsIframeVisible(false);
        const iframe = document.getElementsByTagName('iframe')[0];
        iframe.parentNode.removeChild(iframe);
    }
    const closeIframe1 = () => {
        setIsIframeVisible(false);
    };
    // View the file in an iframe when the View button is clicked
    const viewFile = () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams();

        // Make a POST request to the server to get the file as a blob
        axios.post(`http://localhost:7000/attendance/get_file?filename=${name1}.pdf`, {
            filename: `${name1}.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
                // Remove the previously created iframe, if it exists
                const oldIframe = document.querySelector('iframe');
                if (oldIframe) {
                    oldIframe.remove();
                }

                // Create a new iframe and set its source to the blob URL
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const iframe = document.createElement('iframe');
                iframe.src = fileURL;
                iframe.style.width = '100%';
                iframe.style.height = `${window.innerHeight}px`;
                document.body.appendChild(iframe);
                setIsLoading(false);
                setIsIframeVisible(true);
                setShowTables(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                setMessage(
                    error.response && error.response.status === 404
                        ? "File not found."
                        : "An error occurred while retrieving the file."
                );
            });
    };
    //view file for cerficates
    const viewFile1 = () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams();

        // Make a POST request to the server to get the file as a blob
        axios.post(`http://localhost:7000/attendance/get_file?filename=${id}.pdf`, {
            filename: `${id}.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
                // Remove the previously created iframe, if it exists
                const oldIframe = document.querySelector('iframe');
                if (oldIframe) {
                    oldIframe.remove();
                }

                // Create a new iframe and set its source to the blob URL
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const iframe = document.createElement('iframe');
                iframe.src = fileURL;
                iframe.style.width = '100%';
                iframe.style.height = `${window.innerHeight}px`;
                document.body.appendChild(iframe);
                setIsLoading(false);
                setShowTables(false);
                setIsIframeVisible(true);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                setMessage(
                    error.response && error.response.status === 404
                        ? "File not found."
                        : "An error occurred while retrieving the file."
                );
            });
    };




    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [users, setUsers] = useState({ blogs: [] });
    const [educationData, setEducationData] = useState([]);
    const [experienceData, setExperienceData] = useState(null);
    const [referenceData, setReferenceData] = useState(null);
    const [showTables, setShowTables] = useState(false);

    const toggleTables = () => {
        setShowTables(!showTables);
        closeIframe(); // or closeIframe1()
    };

    const [employee, setEmployee] = useState(null);
    useEffect(() => {
        const apiUrl = `http://127.0.0.1:7000/attendance/showemp?id=${id}`;

        fetch(apiUrl)
            .then((res) => res.json())
            .then(
                (data) => {
                    console.log(data);
                    setEmployee(data);
                    setEducationData(JSON.parse(data.educationData));
                    setExperienceData(JSON.parse(data.experienceData));
                    setReferenceData(JSON.parse(data.referenceData));
                },
                (error) => {
                    console.error(error);
                }
            );
    }, [id]);

   

    // Render the download and view buttons
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
                        <Nav.Link as={Link} to="/" onClick={closeIframe} className='nav_link1' >
                            <div style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>


                        <Nav.Link as={Link} to="/Admin/Viewemp" onClick={closeIframe} className='nav_link2'>
                            <div style={{ color: "green", fontFamily: "cursive" }}>Employee Details</div>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div class="page-heading">
                <h1>DOCUMENTS</h1>
            </div>
            <div class="download-container">
                <div style={{ color: "red" }} className="message">
                    {message ? <p>{message}</p> : null}
                </div>
                <a onClick={viewFile1} class="view-link" style={{ marginTop: "10px" ,cursor: "pointer"}} disabled={isLoading}>
                    {isLoading ? 'Loading...' : <i >Proof</i>}
                </a>
                <a onClick={viewFile} class="view-link" disabled={isLoading} style={{ marginLeft: '-40px', marginTop: "50px",cursor: "pointer" }}>
                    {isLoading ? 'Loading...' : <i >Certificates</i>}
                </a>
                <a onClick={toggleTables} class="view-link" style={{ marginLeft: '-80px', marginTop: "90px" ,
             cursor: "pointer"}} >
                    {showTables ? "Employee Details" : "Employee Details"} 
                </a>
            </div>
            <div >
          
                {showTables && (
                    <>
                      <div className="employee-details-container">
      <h2>{employee.name}'s Details:</h2>
      <p>Employee ID: {employee.id}</p>
      <p>Email: {employee.email}</p>
      <p>Department: {employee.department}</p>
      <p>dob: {employee.dob}</p>
      <p>Maritalstatus: {employee.Maritalstatus}</p>
      <p>department: {employee.department}</p>
      <p>RNRNO: {employee.RNRNO}</p>
      <p>TNMCNO: {employee.TNMCNO}</p>
      <p>ValidlityDate: {employee.ValidlityDate}</p>
      <p>bankaccnum : {employee.bankaccnum}</p>
      <p>Aadhaarno: {employee.Aadhaarno}</p>
      <p>PanNo: {employee.PanNo}</p>
      <p>IdentificationMark: {employee.IdentificationMark}</p>
      <p>BloodGroup: {employee.BloodGroup}</p>
      <p>Gender: {employee.Gender}</p>
      <p>selectedLanguages: {employee.selectedLanguages}</p>
    </div>
                        <div>
                        <caption>EducationData</caption>
                            {educationData ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>Degree</th>
                                            <th>Major</th>
                                            <th>Institution</th>
                                            <th>Marks</th>
                                            <th>Division</th>
                                            <th>Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {educationData.map((edu, index) => (
                                            <tr key={index}>
                                                <td>{edu.SlNo}</td>
                                                <td>{edu.degree}</td>
                                                <td>{edu.major}</td>
                                                <td>{edu.institution}</td>
                                                <td>{edu.marks}</td>
                                                <td>{edu.division}</td>
                                                <td>{edu.year}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No education data available</p>
                            )}
                        </div>

                        <div>
                        <caption>ExperienceData</caption>
                            {experienceData ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>Organization</th>
                                            <th>Designation</th>
                                            <th>Last Drawn Salary</th>
                                            <th>Location</th>
                                            <th>Experience</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experienceData.map((exp, index) => (
                                            <tr key={index}>
                                                <td>{exp.SlNo}</td>
                                                <td>{exp.Organization}</td>
                                                <td>{exp.designation}</td>
                                                <td>{exp.lastdrawnsalary}</td>
                                                <td>{exp.location}</td>
                                                <td>{exp.experience}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No experience data available</p>
                            )}
                        </div>

                        <div>
                        <caption>ReferenceData </caption>
                            {referenceData ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>References</th>
                                            <th>Organization</th>
                                            <th>Designation</th>
                                            <th>Contact No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referenceData.map((ref, index) => (
                                            <tr key={index}>
                                                <td>{ref.SlNo}</td>
                                                <td>{ref.references}</td>
                                                <td>{ref.Organization}</td>
                                                <td>{ref.designation}</td>
                                                <td>{ref.ContactNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No reference data available</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* <Footer /> */}
        </React.Fragment >
    );
}
export default DownloadButton;
