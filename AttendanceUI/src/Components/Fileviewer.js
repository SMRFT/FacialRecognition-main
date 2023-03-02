import { useState } from 'react';
import axios from 'axios';
import React from "react";
import "./Fileviewer.css";
import "../Logo.css";
import { Navbar, Nav } from "react-bootstrap";
import profile from "../images/smrft.png";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
function DownloadButton(props) {
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const name = params.name;
    const [isIframeVisible, setIsIframeVisible] = useState(false);

    const downloadFile = () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams();

        axios.post(`http://localhost:7000/attendance/get_file?filename=${name}.pdf`, {
            filename: `${name}.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', name + ".pdf");
                document.body.appendChild(link);
                link.click();
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
                if (error.response && error.response.status === 404) {
                    alert('File not found.');
                } else {
                    alert('An error occurred while retrieving the file.');
                }
            });
    }

    const viewFile = () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams();

        axios.post(`http://localhost:7000/attendance/get_file?filename=${name}.pdf`, {
            filename: `${name}.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
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
            .catch(error => {
                console.error(error);
                setIsLoading(false);
                if (error.response && error.response.status === 404) {
                    alert('File not found.');
                } else {
                    alert('An error occurred while retrieving the file.');
                }
            });
    }
    const closeIframe = () => {
        setIsIframeVisible(false);
        const iframe = document.getElementsByTagName('iframe')[0];
        iframe.parentNode.removeChild(iframe);
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
                        <Nav.Link as={Link} to="/" >
                            <div style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>
                        {/* <Nav.Link as={Link} to="/Admin/Viewemp" className='nav_link2'>
                            <div style={{ color: "green", fontFamily: "cursive" }}>Employee Details</div>
                        </Nav.Link> */}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div class="download-container">
                <button id="download-button" onClick={downloadFile} class="download-button" disabled={isLoading}>
                    {isLoading ? <i class="fas fa-spinner fa-spin"></i> : <i class="fas fa-download"></i>}
                </button>

                <button id="view-button" onClick={viewFile} class="view-button" disabled={isLoading}>
                    {isLoading ? 'Loading...' : <i class="fas fa-eye"></i>}
                </button>
                {isIframeVisible && (
                    <div>
                        <button class="download-button" onClick={closeIframe}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                )}
            </div>
        </React.Fragment >
    );
}

export default DownloadButton;
