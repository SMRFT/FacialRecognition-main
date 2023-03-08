
import "../Components/Break.css";
import profile from "../images/smrft.png";
import NavbarComp from "../Components/NavbarComp";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
function Break() {
    const navigate = useNavigate();
    const navigateToBreakstart = () => {
        navigate("/Breakstart");
    };
    const navigateToBreakend = () => {
        navigate("/Breakend");
    };
    return (
        <div className="row">
            <div className="col-lg-12">
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
            <br />

            <div body>
                <Row>
                    <Col xs={4} md={2}>
                        <button className="Breakstart" onClick={navigateToBreakstart}>
                            <b style={{ color: "white" }}>Break Logout</b>
                        </button>
                    </Col>
                    <Col xs={4} md={2}>
                        <button className="BreakEnd" onClick={navigateToBreakend}>
                            <b style={{ color: "white" }}>Break Login</b>
                        </button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default Break;
