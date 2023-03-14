import { useState } from 'react';
import axios from 'axios';
import React from "react";
import "./Fileviewer.css";
// import "../Logo.css";
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
    // Download the file when the Download button is clicked
    const downloadFile = () => {
        setIsLoading(true);
        // setClicked(true);
        const queryParams = new URLSearchParams();

        // Make a POST request to the server to get the file as a blob
        axios.post(`http://localhost:7000/attendance/get_file?filename=${name1}.pdf`, {
            filename: `${name1}.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
                // Create a URL for the blob and create a link to download the file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name + ".pdf");
                document.body.appendChild(link);
                link.click();
                setIsLoading(false);
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
    }

    //proof download 
    const downloadFile1 = () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams();

        // Make a POST request to the server to get the file as a blob
        axios.post(`http://localhost:7000/attendance/get_file?filename=${id}.pdf`, {
            filename: `${id}.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
                // Create a URL for the blob and create a link to download the file
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name + ".pdf");
                document.body.appendChild(link);
                link.click();
                setIsLoading(false);
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
    }
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
                // Create an iframe and set its source to the blob URL
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const iframe = document.createElement('iframe');
                iframe.src = fileURL;
                iframe.style.width = '100%';
                iframe.style.height = `${window.innerHeight}px`;
                document.body.appendChild(iframe);
                setIsLoading(false);
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
                // Create an iframe and set its source to the blob URL
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const iframe = document.createElement('iframe');
                iframe.src = fileURL;
                iframe.style.width = '100%';
                iframe.style.height = `${window.innerHeight}px`;
                document.body.appendChild(iframe);
                setIsLoading(false);
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
    // Close the iframe when the Close button is clicked
    const closeIframe = () => {
        setIsIframeVisible(false);
        const iframe = document.getElementsByTagName('iframe')[0];
        iframe.parentNode.removeChild(iframe);
    }
    const closeIframe1 = () => {
        setIsIframeVisible(false);
    };



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
                        <Nav.Link as={Link} to="/" >
                            <div style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>


                        <Nav.Link as={Link} to="/Admin/Viewemp">
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

                {/* <h1>Proof</h1> */}
                <button id="view-button" onClick={viewFile1} class="view-button" disabled={isLoading}>
                    {isLoading ? 'Loading...' : <i class="fas fa-eye">Proof</i>}
                </button>

                {/* <h1>Certificates</h1> */}
                <button id="view-button" onClick={viewFile} class="view-button" disabled={isLoading}>
                    {isLoading ? 'Loading...' : <i class="fas fa-eye">Certificates</i>}
                </button>
                {isIframeVisible && (
                    <div>
                        <button class="download-button1" onClick={closeIframe}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                )}
            </div>
        </React.Fragment >
    );
}

export default DownloadButton;
