import React, { useState } from "react";
import axios from "axios";
import "../Admin.css";
const AdminReg = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setmobile] = useState("");
  const [role, setrole] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7000/attendance/adminreg",
        { name, email, password,mobile,role }
      );
      console.log(response.data);
      setMessage("Register successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div class="screen-2" >
      {/* <h2>Admin Registration</h2> */}
      <form onSubmit={handleSubmit}>
      <div style={{ color: 'green', font: "caption", fontStyle: "Times", fontFamily: "-moz-initial", fontSize: "40px", textAlign: "center" }}>Admin Registration</div>
      <div  className="row d-flex justify-content-center">
          <label>Name:</label>
          <input type="name" className="form-input" onChange={(e) => setName(e.target.value)} />
        </div>
        <div  className="row d-flex justify-content-center">
          <label>Email:</label>
          <input type="email" className="form-input" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div  className="row d-flex justify-content-center">
          <label >Password:</label>
          <input type="password" className="form-input"onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div  className="row d-flex justify-content-center">
          <label >role:</label>
          <input type="role" className="form-input"onChange={(e) => setrole(e.target.value)} />
        </div>
        <div  className="row d-flex justify-content-center">
          <label >mobile:</label>
          <input type="mobile" className="form-input"onChange={(e) => setmobile(e.target.value)} />
        </div>
        <div className="col text-center">
                            <button class="button-78" role="button" type="submit">Register</button>
                            <br />
                            <br />
                            <div style={{ color: "red" }} className="message">{message ? <p>{message}</p> : null}</div>
                        </div>
        {/* <button class="button-78" type="submit">Register</button> */}
      </form>
    </div>
  );
};

export default AdminReg;
