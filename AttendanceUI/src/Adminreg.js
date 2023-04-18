import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";
// import "./Adminreg.css";
const AdminReg = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    
    const validationErrors = {};
   
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }
    if (!role) {
      validationErrors.role = "Role is required";
    }
    if (!mobile) {
      validationErrors.mobile = "Mobile is required";
    } else if (!/^\d+$/.test(mobile)) {
      validationErrors.mobile = "Mobile must contain only numbers";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:7000/attendance/adminreg", {
          name,
          email,
          password,
          mobile,
          role,
        });
        console.log(response.data);
        setMessage("Register successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      setErrors(validationErrors);
    }
  };
  function validateName(name) {
    let error = "";
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    if (!capitalized.match(/^[a-zA-Z]*$/)) {
      error = "*Name should only contain letters";
    }
    return error;
  }
  function validateEmail(email) {
    let error = "";
    if (email !== "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      error = "*Invalid email address";
    }
    return error;
  }
  function validaterole(role) {
    let error = "";
    if (!role.match(/^[a-zA-Z]*$/)) {
      error = "*Role should only contain letters";
    }
    return error;
  }
  function validateMobile(mobile) {
    let error = "";
    if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      error = "*Mobile Number should only contain 10 digits";
    }
    return error;
  }
  const validatePassword = (password) => {
    let error = "";
    if (!password) {
      error = "Password is required";
    } else if (password.length < 6) {
      error = "Password must be at least 6 characters long";
    }
    // Add any additional password validation logic here
    return error;
  };
  return (
    <div class="screen-2">
      {/* <h2>Admin Registration</h2> */}
      <form onSubmit={handleSubmit}>
        <div
          style={{
            color: "green",
            font: "caption",
            fontStyle: "Times",
            fontFamily: "-moz-initial",
            fontSize: "40px",
            textAlign: "center",
          }}
        >
          Admin Registration
        </div>
        <br />
        <div className="row d-flex justify-content-center">
          <label>Name:</label>
          <input
            type="name"
            className="form-input"
            onChange={e => { setName(e.target.value); validateName(e.target.value); }}
          />
          <div style={{ color: "red"}}>{validateName(name) ? <p>{validateName(name)}</p> : null}</div>
        </div>
        <br />
        <div className="row d-flex justify-content-center">
          <label>Email:</label>
          <input
            type="email"
            className="form-input"
            onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
          />
        <div style={{ color: "red" }}>{validateEmail(email) ? validateEmail(email) : null}</div>
        </div>
        <br />
        <div className="row d-flex justify-content-center">
          <label>Password:</label>
          <input
            type="password"
            className="form-input"
            // onChange={(e) => setPassword(e.target.value)}
            onChange={e => { setPassword (e.target.value);  setPassword(e.target.value); }}
          />
         <div style={{ color: "red" }}>{validatePassword(password) ? validatePassword(password) : null}</div>
        </div>
        <br />
        <div className="row d-flex justify-content-center">
          <label>Role:</label>
          <input
            type="role"
            className="form-input"
            // onChange={(e) => setRole(e.target.value)}
            onChange={e => { setRole(e.target.value); validaterole(e.target.value); }}
          />
           <div style={{ color: "red"}}>{validaterole(role) ? <p>{validaterole(role)}</p> : null}</div>
        </div>
        <br />
        <div className="row d-flex justify-content-center">
          <label>Mobile:</label>
          <input
            type="mobile"
            className="form-input"
            onChange={e => { setMobile(e.target.value); validateMobile(e.target.value); }}
          />
         <div style={{ color: "red" }}>{validateMobile(mobile) ? <p>{validateMobile(mobile)}</p> : null}</div>
        </div>
        <br />
        <div className="col text-center">
          {/* <input class="button-78" type="submit" value="Register" className="submit-btn" /> */}
          <button class="button-78" role="button" type="submit">Register</button>
        </div>
        <div
          style={{
            color: "green",
            font: "caption",
            fontStyle: "Times",
            fontFamily: "-moz-initial",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      </form>
    </div>
  );
};

export default AdminReg;

