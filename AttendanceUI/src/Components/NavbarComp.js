import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Routes, Route, Link ,Router} from "react-router-dom";
import Viewemp from './Viewemp';
import Addemp from './Addemp';
import Dashboard from './Dashboard';
import Summary from './Summary';
import "./NavbarComp.css";
import EmployeeHours from "./EmployeeHours"
import Breakdetails from './Breakdetails';
// import Footer from './Footer';
import AdminReg from "./Adminreg";
import Deleteemp from "./Deleteemp";
import Admin from "../Admin";
export default class NavbarComp extends Component {
    //Active link function to keep the navlink active when clicked
    state = {
        activeLink: ''
    }
    handleNavItemClick = (linkName) => {
        this.setState({ activeLink: linkName });
    }
    render() {
        return (
          
            <body>
                <div>
                    
                <header>
                    <Navbar
                        collapseOnSelect
                        expand="lg"
                        style={{ width: '800px', marginLeft: '250px', marginTop: '-50px' }}
                    >
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav
                                className="mr-auto my-2 my-lg"
                                style={{ marginLeft: '100px' }}
                                navbarScroll
                            >
                                <Nav.Link
                                    as={Link}
                                    to="/"
                                    className={`nav_link1 ${this.state.activeLink === 'home' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('home')}
                                >
                                    Home
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="Viewemp"
                                    className={`nav_link2 ${this.state.activeLink === 'employeedetails' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('employeedetails')}
                                >
                                    Employee Details
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="Addemp"
                                    className={`nav_link3 ${this.state.activeLink === 'addemployee' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('addemployee')}
                                >
                                    Add Employee
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="Summary"
                                    className={`nav_link5 ${this.state.activeLink === 'Summary' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('Summary')}
                                >
                                    Summary
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="Dashboard"
                                    className={`nav_link4 ${this.state.activeLink === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('dashboard')}
                                >
                                    Dashboard
                                </Nav.Link>
                            <Nav.Link
                                    as={Link}
                                    to="EmployeeHours"
                                    className={`nav_link6 ${this.state.activeLink === 'EmployeeHours' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('EmployeeHours')}
                                >
                                    EmployeeHours
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="Breakdetails"
                                    className={`nav_link7 ${this.state.activeLink === 'Breakdetails' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('Breakdetails')}
                                >
                                    Breakdetails
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="Deleteemp"
                                    className={`nav_link8 ${this.state.activeLink === 'Deleteemp' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('Deleteemp')}
                                >
                                  Pending Approvals
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to="AdminReg"
                                    className={`nav_link8 ${this.state.activeLink === 'AdminReg' ? 'active' : ''}`}
                                    onClick={() => this.handleNavItemClick('AdminReg')}
                                >
                                  Admin
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    </header>
                    <main>
                    <Routes>
                        <Route exact path='/Viewemp' element={<Viewemp />} ></Route>
                        <Route exact path='/Addemp' element={<Addemp />} ></Route>
                        <Route exact path='/Dashboard' element={<Dashboard />} ></Route>
                        <Route exact path='/Summary' element={<Summary />} ></Route>
                        <Route exact path='/EmployeeHours' element={<EmployeeHours/>} ></Route>
                        <Route exact path='/Breakdetails' element={<Breakdetails/>} ></Route>
                        <Route exact path='/Deleteemp' element={<Deleteemp/>} ></Route>
                        <Route exact path='/AdminReg' element={<AdminReg/>} ></Route>
                    </Routes>
                    </main>
                </div>
              
            </body>
          
        )
    }
}