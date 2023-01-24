import "./App.css";
import profile from "./images/smrft.png";

import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

function App() {
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
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 4 }}>
            <button className="Admin" onClick={navigateToAdmin}>
              <h1 style={{ color: "white" }}><b>Admin</b></h1>
            </button>
          </Col>

          <Col xs={{ span: 4 }}>
            <button className="Login" onClick={navigateToLogin}>
              <h1 style={{ color: "white" }}><b>Login</b></h1>
            </button>
          </Col>

          <Col xs={{ span: 4 }}>
            <button className="Logout" onClick={navigateToLogout}>
              <h1 style={{ color: "white" }}><b>Logout</b></h1>
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
export default App;
