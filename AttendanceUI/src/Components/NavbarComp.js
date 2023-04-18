import React, { Component } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import Viewemp from './Viewemp';
import Addemp from './Addemp';
import Dashboard from './Dashboard';
import Summary from './Summary';
import './NavbarComp.css';
import EmployeeHours from './EmployeeHours';

import AdminReg from '../Adminreg';
import Deleteemp from './Deleteemp';
import profile from "../images/smrft.png";
export default class NavbarComp extends Component {
  // Active link function to keep the navlink active when clicked
  state = {
    activeLink: '',
  };
  handleNavItemClick = (linkName) => {
    this.setState({ activeLink: linkName });
  };
  render() {
    return (
      <body>
        <div className="wrapper">
        <div
            className="sidenav"
            style={{
            height: '100%',
            width: '15%',
            position: 'fixed',
            zIndex: 1,
            top: 0,
            left: 0,
            backgroundColor: '#232323',
            transition: '.5s ease',
            overflowX: 'hidden',
            paddingTop: '1%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}>
            <div className="sidebar-wrapper">
              <div className="sidebar-menu">
              <div className='logo'>
                <img src={profile} className="smrft_logo" alt="logo" />
              </div><br/>
                <ul className="sidebar-nav">
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="/"
                      className={`nav_link1 ${
                        this.state.activeLink === 'home' ? 'active' : ''
                      }`}
                      onClick={() => this.handleNavItemClick('home')}
                    >
                      Home
                    </Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Viewemp"
                      className={`nav_link2 ${
                        this.state.activeLink === 'employeedetails' ? 'active' : ''
                      }`}
                      onClick={() => this.handleNavItemClick('employeedetails')}
                    >
                      Employee
                    </Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Addemp"
                      className={`nav_link3 ${
                        this.state.activeLink === 'addemployee' ? 'active' : ''
                      }`}
                      onClick={() => this.handleNavItemClick('addemployee')}
                    >
                      Add Employee
                    </Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Summary"
                      className={`nav_link5 ${
                        this.state.activeLink === 'Summary' ? 'active' : ''
                      }`}
                      onClick={() => this.handleNavItemClick('Summary')}
                    >
                      Summary
                    </Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Dashboard"
                      className={`nav_link4 ${
                        this.state.activeLink === 'dashboard' ? 'active' : ''
                      }`}
                      onClick={() => this.handleNavItemClick('dashboard')}
                    >
                      Dashboard
                    </Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="EmployeeHours"
                      className={`nav_link6 ${this.state.activeLink === 'EmployeeHours' ? 'active' : ''}`}
                      onClick={() => this.handleNavItemClick('EmployeeHours')}
                    >
                      EmployeeHours
                    </Nav.Link>
                  </li>
                
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="Deleteemp"
                      className={`nav_link8 ${this.state.activeLink === 'Deleteemp' ? 'active' : ''}`}
                      onClick={() => this.handleNavItemClick('Deleteemp')}
                    >
                      Pending Approvals
                    </Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link
                      as={Link}
                      to="AdminReg"
                      className={`nav_link8 ${this.state.activeLink === 'AdminReg' ? 'active' : ''}`}
                      onClick={() => this.handleNavItemClick('AdminReg')}
                    >
                      Admin
                    </Nav.Link>
                  </li>
                </ul>
            </div>
        </div>
     </div>
    <main>
    <Routes>
        <Route exact path='/Viewemp' element={<Viewemp />} ></Route>
        <Route exact path='/Addemp' element={<Addemp />} ></Route>
        <Route exact path='/Dashboard' element={<Dashboard />} ></Route>
        <Route exact path='/Summary' element={<Summary />} ></Route>
        <Route exact path='/EmployeeHours' element={<EmployeeHours/>} ></Route>
        
        <Route exact path='/Deleteemp' element={<Deleteemp/>} ></Route>
        <Route exact path='/AdminReg' element={<AdminReg/>} ></Route>
    </Routes>
    </main>
</div>
</body>
)
}
}