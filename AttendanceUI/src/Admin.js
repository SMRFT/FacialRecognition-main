import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './Components/NavbarComp';
import profile from "./images/smrft.png";
import profile1 from "./images/smrft(1).png";
import Footer from './Components/Footer';
import './Components/Footer.css';
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
// import Admin2 from "./Admin2";
// import NavbarComp from './Components/NavbarComp';
import { useLocation, useNavigate } from 'react-router-dom';
function Admin(props) {
  const location = useLocation();
  // const { email ,name,mobile,role} = location.state || {};
  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  console.log(email, name, mobile, role);
  const [showTooltip, setShowTooltip] = useState(false);
  const handleLogout = () => {
    navigate('/Adminlogin'); // Navigate to login page after logout
  }

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const adminDetails = localStorage.getItem('adminDetails');
      if (adminDetails) {
        const { email, name, mobile, role } = JSON.parse(adminDetails);
        setEmail(email);
        setName(name);
        setMobile(mobile);
        setRole(role);
        try {
          const response = await axios.get('http://127.0.0.1:7000/attendance/UserDetails', {
            params: { email: email } // Set the desired email as a query parameter
          });
          setUserData(response.data);
          setError(null);
        } catch (error) {
          setUserData(null);
          setError(error.response.data);
        }
      }
    };

    fetchUserData();
  }, []);
    // console.log(user) 
    return (
      <div>
  <style>{'body { background-color: rgb(255, 255, 255); }'}</style>
  <div className='main'></div>
  {/* <div className='logo'>
    <img src={profile1} className="smrft_logo" alt="logo" />
  </div> */}
  <div className="employee-container">
    <div
      className="profile-pic"
      onClick={toggleExpanded}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLeOveLZtW4qqRm8Lq3PVtV0y9OK2GrlDVyyCHAxryLBxpEnMi7grxB0NoxakAeuotLmQ&usqp=CAU" alt="Profile Picture" />
      {showTooltip && userData && (
        <div className="profile-pic-tooltip">
          <span className="profile-pic-tooltip-text">{userData.name}  {userData.email}</span>
        </div>
      )}
    </div>
    {expanded && (
      <div className="employee-details">
        {userData && (
          <>
            <h2 className="employee-name">{userData.name}</h2>
            <div className="employee-details-expanded">
              <p className="employee-title">{userData.email}</p>
              <p className="employee-title">{userData.role}</p>
            </div>
          </>
        )}
        <div className="action-bar">
          <button className="action-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    )}
  </div>

            <NavbarComp />
    
            {/* <Footer /> */}
        </div>
    );
}
export default Admin;