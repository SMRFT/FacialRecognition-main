import React, { useEffect, useState } from 'react';
import * as ReactBootStrap from "react-bootstrap";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "../Admin";
import "./NavbarComp.css"
import { Table } from 'react-bootstrap'
import { CSVLink } from 'react-csv';
import profile from "../images/smrft.png";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import Viewemp from "./Viewemp";
import "../Components/AdminCalendar.css";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import Fade from '@material-ui/core/Fade';

function Admincalendar() {
  const params = useParams();
  const name = params.name;
  const sub = name.split('_');
  const id = sub[1]
  let image = ''
  // let [name, setName] = useState("");
  const [eventData, setEventData] = useState([]);
  const [summarydata, setSummaryData] = useState({ workingdays: ' ', leavedays: ' ', overtime: ' ', leavedates: ' ', overtimehours: '' });
  const [show, setShow] = useState(false);
  const [Otbox, setOtbox] = useState(false);
  const [leavebox, setleavebox] = useState(false);
  let [overtimeDates, setOvertimeDates] = useState("");

  const timesheetRef = React.createRef();

  const handleClose = () => setShow(false);
  useEffect(() => {
    handleClose();
  }, []);

  const handleOtDialog = () => setOtbox(false);
  useEffect(() => {
    handleOtDialog();
  }, []);

  const handleleaveDialog = () => setleavebox(false);
  useEffect(() => {
    handleleaveDialog();
  }, []);

  function timesheet() {
    return timesheetRef.current.control;
  }

  let events = {
    locale: "en-us",
    onBeforeEventRender: (args) => {
      if (!args.data.barColor) {
        args.data.barColor = "red";
      }
      args.data.borderColor = "darker";
      args.data.fontColor = "black";
    },
    onBeforeRowHeaderRender: (args) => {
      args.row.horizontalAlignment = "center";
    },
    crosshairType: "Header",
    timeHeaders: [{ "groupBy": "Hour" }, { "groupBy": "Cell", "format": "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    viewType: "Days",
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    days: DayPilot.Date.today().daysInMonth(),
    showNonBusiness: true,
    businessWeekends: false,
    floatingEvents: true,
    eventHeight: 30,
    groupConcurrentEvents: false,
    eventStackingLineHeight: 100,
    allowEventOverlap: true,
    allowAllEvent: true,
    timeRangeSelectedHandling: "Enabled",
  }

  const month = DayPilot.Date.today().getMonth() + 1;
  const empid = {
    id: id,
    month: month

  };
  const [overtimeHours, setOvertimeHours] = useState(0);
  async function fetchSummaryData() {
    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", empid);
    const { data: summarydetails } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/SummaryDetails", empid)
    summarydetails.forEach((emp) => {
      let empdata = {};
      empdata["id"] = emp.id;
      // empdata["text"] = "hii";
      empdata["month"] = emp.month;
      empdata["overtimedate"] = emp.overtimedate;
      empdata["workingdays"] = emp.workingdays;
      empdata["leavedays"] = emp.leavedays;
      empdata["overtimedate"] = emp.overtimedate;
      empdata["overtimehours"] = emp.overtimehours;
      empdata["overtime"] = emp.overtime;
      empdata["leavedates"] = emp.leavedates;


      setSummaryData({
        workingdays: emp.workingdays,
        leavedays: emp.leavedays,
        overtime: emp.overtime,
        overtimedate: emp.overtimedate,
        leavedates: emp.leavedates,
        overtimehours: emp.overtimehours
      });
    });
    // let dates = summarydata.leavedates.split(',');
    // const values = Object.values(summarydata.leavedates);
    // const dates = summarydata.leavedates.split(',');
    // console.log(dates)
    setEventData(calendarData);
    timesheet().update({ events: eventData });
  }
  useEffect(() => {
    fetchSummaryData();
  }, []);

  async function previous() {
    const currentmonthstartdate = timesheet().visibleStart();
    const prevmonthstartdate = currentmonthstartdate.addMonths(-1);
    const prevMonth = prevmonthstartdate.getMonth() + 1;
    const prevMonthPayload = {
      id: id,
      month: prevMonth
    };
    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", prevMonthPayload);
    const { data: summarydetails } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/SummaryDetails", prevMonthPayload);
    setSummaryDetails(summarydetails);
    timesheet().update({
      startDate: prevmonthstartdate,
      days: prevmonthstartdate.daysInMonth(),
      events: calendarData
    });
  }
  function setSummaryDetails(summarydetails) {
    summarydetails.forEach((emp) => {
      let empdata = {};
      empdata["id"] = emp.id;
      empdata["month"] = emp.month;
      empdata["workingdays"] = emp.workingdays;
      empdata["leavedays"] = emp.leavedays;
      empdata["overtime"] = emp.overtime;
      console.log(emp)
      setSummaryData({
        workingdays: emp.workingdays,
        leavedays: emp.leavedays,
        overtime: emp.overtime
      });
    });
  }
  async function next() {
    const currentmonthstartdate = timesheet().visibleStart();
    const nextmonthstartdate = currentmonthstartdate.addMonths(1);
    const nextMonth = nextmonthstartdate.getMonth() + 1;
    const nextMonthPayload = {
      id: id,
      month: nextMonth
    };
    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", nextMonthPayload);
    const { data: url } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/SummaryDetails", nextMonthPayload)
    timesheet().update({
      startDate: nextmonthstartdate,
      days: nextmonthstartdate.daysInMonth(),
      events: calendarData
    });
  }
  ////retrive image
  image = "http://localhost:7000/media/my_Employee/picture/" + name + ".jpg"

  ///export 
  const [userdata, setUserdata] = useState([]);
  useEffect(() => {
    const getuserdata = async () => {
      fetch("http://127.0.0.1:7000/attendance/EmployeeExport", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name
        }),
      })
        .then((res) => res.json())
        .then(
          (data) => {
            setUserdata(data)
            // console.log(data)
          },

        );

    }
    getuserdata();
    // console.log(setUserdata)
  }, []);

  return (
    <div>
      <div>
        <style>{"body { background-color: rgb(255, 255, 255); }"}</style>
        <div className="main"></div>
        <div className="logo">
          <img src={profile} className="smrft_logo" alt="logo" />
        </div>
      </div>
      <Navbar style={{ width: "500px", marginLeft: "500px", marginTop: "-90px" }}>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mr-auto my-2 my-lg-0" style={{ maxHeight: "200px" }} navbarScroll>
            <Nav.Link as={Link} to="/" className='nav_link1'>
              <div style={{ color: "green", fontFamily: "cursive" }}>Home</div>
            </Nav.Link>
            <Nav.Link as={Link} to="/Admin/Viewemp" className='nav_link2'>
              <div style={{ color: "green", fontFamily: "cursive" }}>Employee Details</div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="col-sm-8">
        <i>
          <CSVLink data={userdata} filename={name} class="buttonDownload"></CSVLink></i>
      </div>
      <br />
      <img src={`${image}`} class="center" />
      <br />
      <div class="name">{name}</div>
      <br />
      <i style={{ color: "green", fontSize: "35px", marginBottom: "200px", marginLeft: "1850px" }} onClick={() => setShow(true)} data-toggle="modal" className="bi bi-journal-text" />
      <div className='modal-dialog'>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>SUMMARY</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <b>Employee Id: </b>{empid.id}
              <br />
              <b>Name: </b>{name}
              <br />
              <b>Over Time Days: </b>{summarydata.overtime} <i style={{ color: "green", fontSize: "20px" }} onClick={() => setOtbox(true)} className="bi bi-file-plus"></i>
              <div style={{ float: "right" }}>
                <i style={{ color: "green", fontSize: "20px" }} onClick={() => setOtbox(false)} className="bi bi-cross"></i>
                <Fade in={Otbox}>
                  <ReactBootStrap.Table className="table table-hover table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Worked Hours</th>
                        <th>Overtime Hours</th>

                      </tr>
                    </thead>
                    <tbody>
                      <tr key={id}>
                        <td>{summarydata.overtimedate}</td>
                        <td>{ }</td>
                        <td>{summarydata.overtimehours}</td>
                      </tr>
                    </tbody>
                  </ReactBootStrap.Table>
                </Fade>
              </div>
              <br />
              <b>Working Days: </b>{summarydata.workingdays}
              <br />
              <b>Leave Days: </b>{summarydata.leavedays} <i style={{ color: "green", fontSize: "20px" }} onClick={() => setleavebox(true)} className="bi bi-file-plus"></i>
              <div style={{ float: "right" }}>
                <Fade in={leavebox}>
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td>{summarydata.leavedates}</td>
                    </tbody>
                  </table>
                </Fade>
              </div>
              <br />
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div className={"toolbar"}>
        <button style={{ borderRadius: 10 }} class="previous" type="button" onClick={ev => previous()}>PREVIOUS</button>
        <button style={{ borderRadius: 10 }} class="next" type="button" onClick={ev => next()}>NEXT</button>
      </div>

      <div className='AdminCalendar'>
        <DayPilotScheduler
          {...events}
          ref={timesheetRef}
          events={eventData}
        />
      </div>
    </div>
  );
}
export default Admincalendar;