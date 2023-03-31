import React, { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditForm from "./EditForm";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import Pagination from "react-js-pagination";
import { useMemo } from "react";
// import "../Logo.css";
import Footer from "./Footer"
import "./Viewemp.css";
import { Cursor } from "mongoose";
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

  ////edit employee
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
const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
const requestSort = (key) => {
  let direction = "ascending";
  if (
    sortConfig &&
    sortConfig.key === key &&
    sortConfig.direction === "ascending"
  ) {
    direction = "descending";
  }
  setSortConfig({ key, direction });
};

const sortedData = useMemo(() => {
  let sortedData = [...paginatedResults];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      const nameA = (a[sortConfig.key] || '').toString().toLowerCase();
      const nameB = (b[sortConfig.key] || '').toString().toLowerCase();
      if (nameA < nameB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }
  return sortedData;
}, [paginatedResults, sortConfig]);




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

        <div className="table-wrapper">
        {/* {filteredResults.length === 0 ? (
        <p>No data available</p>
      ) : ( */}
          <ReactBootStrap.Table
            striped borderless hover 
          >
            <thead align="center">
              <tr style={{backgroundColor: "#E0FFFF"}}>
                <th onClick={() => requestSort("id")}>
                  <div
                   style={{ color: 'seagreen', fontFamily: 'Helvetica', fontSize: '16px',cursor: "pointer"}}
                  >
                    <b>Employee Id</b>
                  </div>
                </th>
                <th  onClick={() => requestSort("name")}>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: '16px',
                      textAlign: 'center',
                      cursor: "pointer"
                    }}
                  >
                    <b>Name</b>
                  </div>
                </th>
                <th onClick={() => requestSort("department")}>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: '16px',
                      textAlign: 'center',cursor: "pointer"
                    }}
                  >
                    <b>Department</b>
                  </div>
                </th>
                <th onClick={() => requestSort("designation")}>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: '16px',
                      textAlign: 'center',cursor: "pointer"
                      
                    }}
                  >
                    <b>Designation</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <b>Mobileno</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <b>Address</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <b>Actions</b>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody align="center">
              {sortedData.map((user) => (
                <tr style={{backgroundColor: "#E0FFFF",borderColor:"#E0FFFF"}} key={user.id}>
                  <td>{user.id}</td>
                  <td><div style={{ display: "flex", alignItems: "center" }}><img src={`http://localhost:7000${user.imgSrc}`} width="80" height="80" className="rounded-circle" />
                    <div style={{ marginLeft: "20px" }}>{user.name}</div>
                  </div>
                  </td>
                  <td>{user.department}</td>
                  <td>{user.designation}</td>
                  <td>{user.mobile}</td>
                  <td>{user.address}</td>
                  <td>
                    <OverlayTrigger
                      overlay={<Tooltip id="tooltip">Edit</Tooltip>}
                      placement="left"
                    >
                      <button
                        onClick={() => editEmployee(user)}
                        className="btn text-warning btn-act"
                        data-toggle="modal"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      overlay={<Tooltip id="tooltip">Delete</Tooltip>}
                      placement="left"
                    >
                      <button
                        onClick={() => deleteEmployee(user)}
                        className="btn text-danger btn-act"
                        data-toggle="modal"
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                  
                    </OverlayTrigger>

                    <OverlayTrigger
                      overlay={<Tooltip id="tooltip">Calendar</Tooltip>}
                      placement="left"
                    >
                      <Link
                        to={`/AdminCalendar/${user.name + '_' + user.id}`}
                        activeClassName="current"
                      >
                        <button
                          onClick={() => navigateToCalendar(user)}
                          className="btn text-primary btn-act"
                          data-toggle="modal"
                        >
                          <i className="bi bi-calendar3-week"></i>
                        </button>
                      </Link>
                    </OverlayTrigger>

                    <OverlayTrigger
                      overlay={<Tooltip id="tooltip">Files</Tooltip>}
                      placement="left"
                    >
                      <Link
                        to={`/Fileviewer/${user.name + '_' + user.id}`}
                        activeClassName="current"
                      >
                        <button
                          onClick={() => navigateToFileviewer(user)}
                          className="btn text-primary btn-act"
                          data-toggle="modal"
                        >
                          <i className="bi bi-file-earmark-text"></i>
                        </button>
                      </Link>
                    </OverlayTrigger>

                  </td>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Edit Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <EditForm theuser={selectedUser} />
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                  </Modal>
                  
                </tr>
     
              ))}
            </tbody>
          </ReactBootStrap.Table>
          {/* )} */}
          <div className="pagination-container">
          <Pagination
                activePage={activePage}
                itemsCountPerPage={ITEMS_PER_PAGE}
                totalItemsCount={filteredResults.length}
                pageRangeDisplayed={20}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText="Prev"
                nextPageText="Next"
              />
          </div>
        </div >
        <footer>
        <Footer/>
      </footer>
      </body >
    );
  }
};
export default Home;