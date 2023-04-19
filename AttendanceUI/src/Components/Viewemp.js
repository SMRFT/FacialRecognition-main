import React, { useState, useEffect, useCallback, useRef} from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditForm from "./EditForm";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import Pagination from "react-js-pagination";
import { useMemo } from "react";
import Card from 'react-bootstrap/Card';
import "./Viewemp.css";
///view employee
const Home = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({ blogs: [] });
  useEffect(() => {
    fetch("http://127.0.0.1:7000/attendance/showemp")
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setUsers({ blogs: data });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);
  //hide and show actions
  const showActionsBoxRef = useRef(null); // Ref for the showActionsBox element
  // const [showActionsBox, setShowActionsBox] = useState(false);
  // const [selectedUseraction, setSelectedUseraction] = useState(null);
  const [showaction, setShowaction] = useState(false);
  const [showActionsBox, setShowActionsBox] = useState(false);
  const [selectedUseraction, setSelectedUseraction] = useState(null);
  const handleHide = (user) => {
    setShowaction(true);
    setShowActionsBox(!showActionsBox);
    setSelectedUseraction(user);
  };

  const handleOutsideClick = (event) => {
    if (
      showActionsBoxRef.current &&
      !showActionsBoxRef.current.contains(event.target)
    ) {
      setShowActionsBox(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  //edit employee
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  useEffect(() => {
    handleClose();
  }, []);
  const [selectedUser, setselectedUser] = useState(null);
  const editEmployee = async (selectedEmployee) => {
    setselectedUser(selectedEmployee);
    setShow(true);
  };
  //Navigate to Calendar
  const navigate = useNavigate();
  const navigateToCalendar = () => {
  };
 //Navigate to Files
  const Fileviewer = useNavigate();
  const navigateToFileviewer = () => {
  };
  ///delete employee
  const deleteEmployee = async (e) => {
    if (window.confirm("Are you sure you want to delete this employee?"))
      await fetch("http://127.0.0.1:7000/attendance/delemp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: e.id,
        }),
      });
    window.location.reload(true);
  };
// fetch the data from the server and update the state
const [breakusers, setBreakusers] = useState([]);
const [employeesOnBreak, setEmployeesOnBreak] = useState([]);
const [employeesActive, setEmployeesActive] = useState([]);
const [employeesNotActive, setEmployeesNotActive] = useState([]);
const fetchData = useCallback(() => {
  fetch("http://127.0.0.1:7000/attendance/breakdetails")
    .then((res) => res.json())
    .then(
      (data) => {
        setIsLoaded(true);
        setBreakusers(data);
        setEmployeesOnBreak(data.employees_on_break);
        setEmployeesActive(data.employees_active);
        setEmployeesNotActive(data.employees_not_active);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
}, []);
// Call the fetchData function when the component mounts
useEffect(() => {
  fetchData();
}, [fetchData]);
  ///search employee
  const [searchString, setSearchString] = useState("");
  const filteredResults = users.blogs && users.blogs.filter((singleEmpObject) => {
    return Object.values(singleEmpObject).some((val) =>
      val && val.toString().toLowerCase().includes(searchString.toString().toLowerCase())
    );
  });
// State to keep track of the current page
const [activePage, setActivePage] = useState(1);
// Function to handle page change
const handlePageChange = (pageNumber) => {
  setActivePage(pageNumber);
};
// Number of items to show per page
const ITEMS_PER_PAGE = 20;
// Get the index of the first and last items to show on the current page
const indexOfLastItem = activePage * ITEMS_PER_PAGE;
const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
// Slice the filtered results to show only the items for the current page
const paginatedResults = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <body>
        <br />
        <div class="container-input" style={{ width: "200px", float: "left", marginTop: "2%", height: "50px" }}>
          <input
            type="search"
            class="input"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search here !!!"
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
            <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
          </svg>
        </div>
        <br />
        <br />
   <div className="row">
    {paginatedResults.map((user) => (
   <div className="col-md-2 mb-2" key={user.id} style={{  padding: "10px", borderRadius: "5px" }}>
    <Card md={4} className="employee"><br/>
   <div><i style={{float:"right",marginRight:'5%',marginTop:"2%",cursor:"pointer"}} onClick={() => handleHide(user)} className="fa fa-ellipsis-h"></i>
   <div style={{ float: "right", marginRight: "5%" }}>
  {employeesOnBreak.some((breakUser) => breakUser.id === user.id) ? (
    <button className="break-btn">Break</button>
  ) : employeesActive.some((activeUser) => activeUser.id === user.id) ? (
    <button className="active-btn">Active</button>
  ) : (
    <button className="not-active-btn">Not Active</button>
  )}
</div>

{showActionsBox && selectedUseraction === user && (
  <div
    ref={showActionsBoxRef}
    style={{
      position: "absolute",
      borderRadius:"5%",
      backgroundColor:"ghostwhite",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
      padding: "4px 4px",
      zIndex: 1,
      top: "50px",
      right: 0
    }}
    >
    <button
          onClick={() => editEmployee(user)}
          className="btn text-warning btn-act"
          data-toggle="modal"
          style={{border:"none"}}
      >
        <i className="bi bi-pencil-fill"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}> Edit</div>
        </button>
        <br/>
        <button
          onClick={() => deleteEmployee(user)}
          className="btn text-danger btn-act"
          data-toggle="modal"
          style={{border:"none"}}
        >
        <i className="bi bi-trash-fill"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}> Delete</div>
      </button><br/>
      <Link
          to={`/AdminCalendar/${user.name + '_' + user.id}`}
          activeClassName="current">
          <button
            onClick={() => navigateToCalendar(user)}
            className="btn text-primary btn-act"
            data-toggle="modal"
            style={{border:"none"}}
          >
          <i className="bi bi-calendar3-week"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}> Calendar</div>
          </button>
        </Link><br/>
        <Link
          to={`/Fileviewer/${user.name + '_' + user.id}`}
          activeClassName="current"
          >
          <button
            onClick={() => navigateToFileviewer(user)}
            className="btn text-primary btn-act"
            data-toggle="modal"
            style={{border:"none"}}
          >
          <i className="bi bi-file-earmark-text"></i><div style={{color:"#7F8487",float:"right",marginLeft:"10px"}}> Files</div>
          </button>
        </Link><br/>
        </div> )}
        </div><br/><br/>
      <Card.Img style={{ display: "block", margin:"auto", width:"70px", height:"70px", borderRadius:"50%" }}
        src={`http://localhost:7000${user.imgSrc}`} className="rounded-circle" />
      <Card.Body>
        <Card.Title><center style={{color:"#525E75",font:"caption",fontWeight:"bold",fontFamily:"sans-serif",fontSize:"14px"}}>{user.name}</center></Card.Title>
        <Card.Text>
        <div><center style={{color:"#BFBFBF",font:"caption",fontFamily:"initial"}}>{user.designation}</center></div><br/>
        <Button style={{backgroundColor:"#ECFCFF",color:"black",width:"100%",borderColor:"#C8E6F5"}}>
        <div style={{color:"#7F8487",float:"left",font:"caption",fontFamily:"cursive",fontSize:"12px"}}>Department</div>
        <div style={{color:"#7F8487",float:"right",font:"caption",fontFamily:"cursive",fontSize:"12px"}}>Date Hired</div><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Garamond",fontSize:"12px"}}>{user.department}</div>
        <div style={{float:"right",font:"caption",fontFamily:"Times New Roman",fontSize:"12px"}}>{user.dateofjoining}</div><br/><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Copperplate",fontSize:"14px"}}>
          <i style={{fontWeight:"bold",fontSize:"16px", color: "black", textShadow: "0.4px 0.4px black"}} className="bi bi-envelope"></i> {user.email}
        </div><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Copperplate",fontSize:"14px"}}>
          <i style={{fontWeight:"bold",fontSize:"14px", color: "black", textShadow: "0.4px 0.4px black"}} className="bi bi-telephone"></i> {user.mobile}
        </div><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Copperplate",fontSize:"14px"}}>
          <i style={{fontWeight:"bold",fontSize:"16px", color: "black", textShadow: "0.4px 0.4px black"}} className="bi bi-house-door"></i> {user.address}
        </div>
        </Button>
        </Card.Text>
      </Card.Body>
      <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="modal-100w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title style={{color:"green"}}>Edit Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditForm theuser={selectedUser} />
      </Modal.Body>
    </Modal>
    </Card>
    </div>
    ))}
    </div>
    </body >
    );
  }
};
export default Home;