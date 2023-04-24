import React, { useState, useEffect, useCallback, useRef} from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button , OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditForm from "./EditForm";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import Pagination from "react-js-pagination";
import { useMemo } from "react";
import Card from 'react-bootstrap/Card';
import "./Viewemp.css";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MUIButton from '@material-ui/core/Button';
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
  const countFilteredResults = filteredResults.length;
  const countData = users.blogs.length; 
// State to keep track of the current page
const [activePage, setActivePage] = useState(1);
// Function to handle page change
const handlePageChange = (pageNumber) => {
  setActivePage(pageNumber);
};
const handleclicktoaddemp = () => {
  navigate('/Admin/addemp'); // Navigate to login page after logout
}
const handleclicktosummary = () => {
  navigate('/Admin/Summary'); // Navigate to login page after logout
}
// Number of items to show per page
const ITEMS_PER_PAGE = 12;
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
      <body className="viewemp">
        <br />
        <div class="input-container3" style={{ width: "200px", float: "right", marginTop: "-4%",marginRight:"88%"}}>
        <input
            type="search"
            class="input3"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search something..."
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon3"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <rect fill="white"></rect> <path d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z" clip-rule="evenodd" fill-rule="evenodd"></path> </g></svg>
  </div>
  
<div className="employee-count">
  {filteredResults.length > 0 ? (
    <p>{countFilteredResults} Employees</p>
  ) : (
    <p>0 Employees</p>
  )}
</div>



<button className="add-emp-button" onClick={handleclicktoaddemp}>
  <span className="add-icon">&#43;</span>
  Add Employee
</button>
<MUIButton
style={{marginLeft:"55%",marginTop:"-3.9%"}}
  variant="contained"
  color="primary"
  startIcon={<CloudDownloadIcon />}
  onClick={handleclicktosummary}
>
  summary
  </MUIButton>

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
        <div><center style={{color:"#BFBFBF",font:"caption",fontFamily:"initial"}}>{user.id}</center>
        <center style={{color:"#BFBFBF",font:"caption",fontFamily:"initial"}}>{user.designation}</center></div><br/>
        <Button style={{backgroundColor:"#ECFCFF",color:"black",width:"100%",borderColor:"#C8E6F5"}}>
        <div style={{color:"#7F8487",float:"left",font:"caption",fontFamily:"cursive",fontSize:"12px"}}>Department</div>
        <div style={{color:"#7F8487",float:"right",font:"caption",fontFamily:"cursive",fontSize:"12px"}}>Date Hired</div><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Garamond",fontSize:"12px"}}>{user.department}</div>
        <div style={{float:"right",font:"caption",fontFamily:"Times New Roman",fontSize:"12px"}}>{user.dateofjoining}</div><br/><br/>
        <div style={{float:"left",font:"caption",fontFamily:"Copperplate",fontSize:"13px"}}>
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
    
    <div className="pagination-container">
          <Pagination
                activePage={activePage}
                itemsCountPerPage={ITEMS_PER_PAGE}
                totalItemsCount={filteredResults.length}
                pageRangeDisplayed={12}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText="Prev"
                nextPageText="Next"
              />
          </div>
    </body >
    );
  }
};
export default Home;