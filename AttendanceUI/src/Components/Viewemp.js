import React, { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditForm from "./EditForm";
import { useNavigate } from "react-router-dom";
import { Search } from "@material-ui/icons";
// import SummarizeIcon from '@mui/icons-material/Summarize';
//import bootstrap from 'bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import AdminCalendar from "./AdminCalendar";
import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import moment from "moment";
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

  //Export details
  const params = useParams();
  const name = params.name;
  let newDate = new Date()
  const [userdata, setUserdata] = useState([]);
  const [myMonth, setMyMonth] = useState(new Date());
  const [myYear, setMyYear] = useState(new Date());
  const [myDay, setMyDay] = useState(newDate);
  const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
  const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);

  useEffect(() => {
    const getuserdata = async () => {
      fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: myMonth.getMonth() + 1,
          year: myYear.getFullYear(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserdata(data);
        });
    };
    getuserdata();
  }, [myMonth, myYear]);

  useEffect(() => {
    setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
  }, [myMonth, myYear, setMyDay]);

  const renderDayContents = (day, date) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  ///search employee
  const [searchString, setSearchString] = useState("");
  const filteredResults = users.blogs.filter((singleEmpObject) => {
    return Object.values(singleEmpObject).some((val) =>
      val
        .toString()
        .toLowerCase()
        .includes(searchString.toString().toLowerCase())
    );
  });
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <body>
        <br />
        <br />
        <div>
          <i><CSVLink style={{ float: "right", fontSize: "40px", cursor: "pointer", color: "darkblue" }}
            className="fa fa-download" data={userdata} filename={"payroll"}></CSVLink></i>
        </div>
        <div style={{ float: "right", cursor: "pointer" }}>
          <label>Year</label>
          <DatePicker style={{ textAlign: "center" }}
            selected={myYear}
            onChange={(date) => setMyYear(date)}
            showYearPicker
            dateFormat="yyyy"
          />
        </div>
        <div style={{ float: "right", cursor: "pointer" }}>
          <label>Month</label>
          <DatePicker
            selected={myMonth}
            onChange={(date) => setMyMonth(date)}
            showMonthYearPicker
            dateFormat="MMMM"
            renderCustomHeader={({ date }) => <div></div>}
          />
        </div><br />

        <div className="input-group rounded" style={{ width: "250px", float: "left" }}>
          <input
            type="search"
            className="form-control rounded"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search here !!!"
            aria-label="Search"
            aria-describedby="search-addon"
          />
          <span className="input-group-text border-0" id="search-addon">
            <i class="fa fa-search" aria-hidden="true"></i>
          </span>
        </div>
        <br />
        <br />
        <div className="table">
          <ReactBootStrap.Table
            striped
            bordered="danger"
            borderColor="danger"
            hover
            variant="success"
          >
            <thead align="center">
              <tr>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Employee Id</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Name</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Department</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
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
                      fontSize: "18px",
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
                      fontSize: "18px",
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
                      fontSize: "18px",
                    }}
                  >
                    <b>Actions</b>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody align="center">
              {filteredResults.map((user) => (
                <tr key={user.id}>
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
                      overlay={<Tooltip id={`tooltip-top`}>Edit</Tooltip>}
                    >
                      <button
                        onClick={() => editEmployee(user)}
                        className="btn text-warning btn-act"
                        data-toggle="modal"
                      >
                        <i
                          style={{ color: "black" }}
                          className="bi bi-pencil-square"
                        ></i>
                      </button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      overlay={<Tooltip id="bottom">Delete</Tooltip>}
                    >
                      <button
                        onClick={() => deleteEmployee(user)}
                        className="btn text-danger btn-act"
                        data-toggle="modal"
                      >
                        <i className="bi bi-person-x-fill"></i>
                      </button>
                    </OverlayTrigger>

                    <OverlayTrigger
                      overlay={<Tooltip id="tooltip">Calender</Tooltip>}
                    >
                      <Link
                        to={`/AdminCalendar/${user.name + '_' + user.id}`}
                        activeClassName="current"
                      >
                        <button
                          onClick={() => navigateToCalendar(user)}
                          className="btn text-primary btn-act"
                          data-toggle="modal">
                          <i className="bi bi-calendar3-week-fill"></i>
                        </button>
                      </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                      overlay={<Tooltip id="tooltip">Documents</Tooltip>}
                    >
                      <Link
                        to={`/Fileviewer/${user.name}`}
                        activeClassName="current"
                      >
                        <button
                          onClick={() => navigateToFileviewer(user)}
                          className="btn text-primary btn-act"
                          data-toggle="modal">
                          <i class="bi bi-file-text"></i>
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
        </div >
      </body >
    );
  }
};
export default Home;