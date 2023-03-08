//The component is rendering a header section that includes a logo image of smrft and 
//Buttons which navigates to Admin page,Login page,Logout page and Break
import "./App.css";
import profile from "./images/smrft.png";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

function App() {
  //Functions to navigate to different pages
  const navigate = useNavigate();
  const navigateToAdmin = () => {
    navigate("/adminlogin");
  };
  const navigateToLogin = () => {
    navigate("/WebcamCaptureLogin");
  };
  const navigateToLogout = () => {
    navigate("/WebcamCaptureLogout");
  };
  const navigateToBreak = () => {
    navigate("/Break");
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
      <br />

      <div body>
        <Row>
          <Col xs={8} md={3}>
            <button className="Admin" onClick={navigateToAdmin}>
              <h1><b>Admin</b></h1>
            </button>
          </Col>
          <Col xs={8} md={3}>
            <button className="Login" onClick={navigateToLogin}>
              <h1><b>Login</b></h1>
            </button>
          </Col>
          <Col xs={8} md={3}>
            <button className="Logout" onClick={navigateToLogout}>
              <h1><b>Logout</b></h1>
            </button>
          </Col>
          <Col xs={8} md={3}>
            <button className="Break" onClick={navigateToBreak}>
              <h1><b>Break</b></h1>
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default App;
