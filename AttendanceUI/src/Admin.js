import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './Components/NavbarComp';
import profile from "./images/smrft.png";
import profile1 from "./images/smrft(1).png";
import Footer from './Components/Footer';
import './Components/Footer.css';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
function Admin() {
    const location = useLocation();
    const { email ,name,mobile,role} = location.state || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement your logout logic here
        // For example, clear user details from state or remove session/cookie
        navigate('/Adminlogin'); // Navigate to login page after logout
    }
    // console.log(user) 
    return (
        <div>
            <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
            <div className='main'></div>
            <div className='logo'>
                <img src={profile1} className="smrft_logo" alt="logo" />
            </div>
          <div>
            <div className="profile-container">
                {/* Render user details on top of the page */}
                {email && (
                    <div className="profile">
                        <div className="profile-info">
                            <p>{role}</p>
                            <p>{email}</p>
                            <p>{mobile}</p>
                            <p>{name}</p>
                            {/* Render other user details as needed */}
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
           
        </div>
            <NavbarComp />

            {/* <Footer /> */}
        </div>
       
    );
}
export default Admin;