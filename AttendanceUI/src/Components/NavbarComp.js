import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Routes, Route, Link } from "react-router-dom";
import Viewemp from './Viewemp';
import Addemp from './Addemp';
import Dashboard from './Dashboard';

import "./NavbarComp.css"
export default class NavbarComp extends Component {
    render() {
        return (
            <body>
                <div>
                    <Navbar style={{ width: '700px', marginLeft: '350px', marginTop: '-90px' }}>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="mr-auto my-2 my-lg"
                                style={{ marginLeft: '100px' }}
                                navbarScroll
                            >
                                <Nav.Link as={Link} to="/" className='nav_link1'>Home</Nav.Link>
                                <Nav.Link as={Link} to="Viewemp" className='nav_link2'>Employee Details</Nav.Link>
                                <Nav.Link as={Link} to="Addemp" className='nav_link3'>Add Employee</Nav.Link>
                                <Nav.Link as={Link} to="Dashboard" className='nav_link4'>Dashboard</Nav.Link>

                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Routes>
                        <Route exact path='/Viewemp' element={<Viewemp />} ></Route>
                        <Route exact path='/Addemp' element={<Addemp />} ></Route>
                        <Route exact path='/Dashboard' element={<Dashboard />} ></Route>

                    </Routes>
                </div>
            </body>)
    }
}




