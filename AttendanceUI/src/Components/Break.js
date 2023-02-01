
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
                        <Nav.Link as={Link} to="/" >
                            <div style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <br />

            <div body>
                <Row gutter={[16, 16]}>
                    <Col xs={{ span: 2 }}>
                        <button className="Breakstart" onClick={navigateToBreakstart}>
                            <h1 style={{ color: "White" }}><b>Break Logout</b></h1>
                        </button>
                    </Col>
                    <Col xs={{ span: 2 }}>
                        <button className="BreakEnd" onClick={navigateToBreakend}>
                            <h1 style={{ color: "white" }}><b>Break Login</b></h1>
                        </button>
                    </Col>
                </Row>
            </div>
        </div>
    );
}
export default Break;
