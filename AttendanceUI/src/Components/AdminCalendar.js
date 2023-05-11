//This components renders a Caendar which has employee image,name,
//Download button for exporting payoff details of an employee using id per month
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
import "./NavbarComp.css";
function Admincalendar() {

  //Getting id and name from another file using params
  const params = useParams();
  const name = params.name;
  const sub = name.split('_');
  const id = sub[1]
  const name1 = sub[0]
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState(null);
 
  useEffect(() => {
    const apiUrl = `http://127.0.0.1:7000/attendance/showemp?id=${id}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then(
        (data) => {
          console.log(data);
          setEmployee(data);
          setIsLoaded(true);
        },
        (error) => {
          console.error(error);
          setError(error);
          setIsLoaded(true);
        }
      );
  }, [id]);
  let [summarydata, setSummaryData] = useState([
    { workingdays: ' ', leavedays: ' ', overtime: ' ' }
  ]);

  const [show, setShow] = useState(false);
  const [Otbox, setOtbox] = useState(false);
  const [leavebox, setLeavebox] = useState(false);
  // let [currentMonthPayload, setCurrentMonthPayload] = useState("");
  let [prevMonthPayload, setPrevMonthPayload] = useState("");
  let [nextMonthPayload, setNextMonthPayload] = useState("");
  let [overtimeDates, setOvertimeDates] = useState("");
  let [overtimehours, setOvertimehours] = useState([]);
  let [workedhours, setWorkedhours] = useState([]);
  let [leavedates, setLeaveDates] = useState("");
  const [userdata, setUserdata] = useState([]);
  let [calendarData, setCalendarData] = useState([]);
  let [eventDates, setEventDates] = useState([]);
  let [sundayDates, setSundayDates] = useState([]);

  //Onclick functions for summary modal
  const handleOpen = () => {
    setShow(true);
  }
  const handleClose = () => setShow(false);
  const handleOtDialog = () => setOtbox(false);
  const handleleaveDialog = () => setLeavebox(false);
  useEffect(() => {
    handleOpen();
    handleClose();
    handleOtDialog();
    handleleaveDialog();
  }, []);

  //Timesheet function (Inbuilt)
  const timesheetRef = React.createRef();
  function timesheet() {
    return timesheetRef.current.control;
  }
  //Calendar inbuilt parameters and should be mentioned in the Daypilot component to perform this actions
  let events = {
    locale: "en-us",
    onBeforeRowHeaderRender: (args) => {
      args.row.horizontalAlignment = "center";
    },
    onBeforeCellRender: (args) => {
      if (args.cell.start.getDayOfWeek() === 0) { // Sunday
        if (eventDates.includes(args.cell.start.toString("yyyy-MM-dd"))) {
          args.cell.disabled = false;
          args.cell.cssClass = ""; // remove the "disabled-cell" class
        } else {
          args.cell.disabled = true;
          args.cell.cssClass = "disabled-cell";
          sundayDates.push(args.cell.start.toString("yyyy-MM-dd"));
        }
      }
    },
    onTimeRangeSelected: async (args) => {
      const dp = args.control;
      const form = [
        { name: "LeaveType", id: "leaveType", options: [{ name: "SL", id: "SL" }, { name: "CL", id: "CL" }] }
      ];
      const modal = await DayPilot.Modal.form(form);
      const leaveType = { leavetype: String(Object.values(modal.result)) };
      console.log("date1",args.end.value)
      console.log("starttime:",args.start)
      console.log("endtime:",args.end)
      let datetime = args.end.value;
      let dateObj = new Date(datetime);
      let year = dateObj.getFullYear();
      console.log("year:",year);
      const [date, time] = datetime.split('T');
      console.log("date",date);
      let iddate = id + date;
      let start =args.start;
      let end =args.end;
      const today = DayPilot.Date.today()
      const month = today.getMonth()+1;
      let shift="None";
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: Object.values(modal.result)
      });
      try {
        const response = await fetch('http://127.0.0.1:7000/attendance/admincalendarlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...leaveType,id:id,date:date,name:name1 + '_' + id,month:month,year:year,start:start,end:end,iddate:iddate,shift:shift})
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
    crosshairType: "Header",
    timeHeaders: [{ "groupBy": "Hour" }, { "groupBy": "Cell", "format": "mm" }],
    scale: "CellDuration",
    cellDuration: 30,
    viewType: "Days",
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
// Function to fetch the event data (working days) for the current month (as displayed on the timesheet calendar)
async function fetchCalendarData() {
  const today = DayPilot.Date.today();
  const month = today.getMonth() + 1;
  const year = today.getYear();
  const currentMonthPayload = {
    id: id,
    month: month,
    year: year
  };
  const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", currentMonthPayload);
  const eventDatesArr = calendarData.map(item => item.date);
  setEventDates(eventDatesArr);
  setCalendarData(calendarData);
  // Update the timesheet calendar with the fetched data
  timesheet().update({
    startDate: today.firstDayOfMonth(),
    days: today.daysInMonth(),
    events: calendarData
  });
  // Fetch the user data for the current month
  getuserdata(month, year);
}
// Call fetchCalendarData when the component mounts
useEffect(() => {
  fetchCalendarData();
}, []);


  // Function to get the user data (export details) for a specific month and year
  const getuserdata = async (month, year) => {
    try {
      const response = await fetch("http://127.0.0.1:7000/attendance/EmployeeExport", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          month: month,
          year: year
        }),
      });
      const data = await response.json();
      setUserdata(data);
    } catch (error) {
      // handle error
    }
  };

  // Function to handle the "previous" button click
  // Fetches the event data (working days) and user data for the previous month, and updates the timesheet calendar and user data accordingly
  async function previous() {
    const currentmonthstartdate = timesheet().visibleStart();
    const prevmonthstartdate = currentmonthstartdate.addMonths(-1);
    const prevMonth = prevmonthstartdate.getMonth() + 1;
    const prevMonthYear = prevmonthstartdate.getYear();
    prevMonthPayload = {
      id: id,
      month: prevMonth,
      year: prevMonthYear
    };

    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", prevMonthPayload);
    timesheet().update({
      startDate: prevmonthstartdate,
      days: prevmonthstartdate.daysInMonth(),
      events: calendarData
    });
    // Fetch the user data for the previous month
    getuserdata(prevMonth, prevMonthYear);
  }

  // Function to handle the "next" button click
  // Fetches the event data (working days) and user data for the next month, and updates the timesheet calendar and user data accordingly
  async function next() {
    const currentmonthstartdate = timesheet().visibleStart();
    const nextmonthstartdate = currentmonthstartdate.addMonths(1);
    const nextMonth = nextmonthstartdate.getMonth() + 1;
    const nextMonthYear = nextmonthstartdate.getYear();
    nextMonthPayload = {
      id: id,
      month: nextMonth,
      year: nextMonthYear
    };

    const { data: calendarData } = await DayPilot.Http.post("http://127.0.0.1:7000/attendance/EmpcalendarId", nextMonthPayload);
    timesheet().update({
      startDate: nextmonthstartdate,
      days: nextmonthstartdate.daysInMonth(),
      events: calendarData
    });
    // Fetch the user data for the next month
    getuserdata(nextMonth, nextMonthYear);
  }
  
  // const image = "http://localhost:7000/attendance/profile_image" + employee.profile_picture_id;
  //Active link function to keep the navlink active when clicked

  return (
    <div>
      <div>
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
            <Nav.Link as={Link}  to="/" >
              <div className="nav_link1" style={{ color: "green", fontFamily: "cursive", ':hover': { background: "blue" } }}>Home</div></Nav.Link>


            <Nav.Link as={Link} to="/Admin/Viewemp">
              <div  className="nav_link2"style={{ color: "green", fontFamily: "cursive" }}>Employee Details</div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div class="page-heading">
        <h1>Summary Of Employee</h1>
      </div>
      {/* <div className="col-md-6 col-sm-12 text-md-end text-center">
        <i>
          <CSVLink data={userdata} filename={name} class="buttonDownload"></CSVLink>
        </i>
      </div> */}


      <br />
      <div className="profile">
  <img
    src={`http://localhost:7000/attendance/profile_image?profile_picture_id=${employee?.profile_picture_id}`}
    className="center"
    alt="profile"
  />
  <div className="name">{name1}</div>
</div>

      <br />

      <br />
      <div class="csv">
        <i>
          <CSVLink
            class="fa fa-download"
            data={userdata}
            filename={name}
            title="Download CSV"
          ></CSVLink>
        </i>
      </div>
      <div className={"toolbar"}>
        <button style={{ borderRadius: 10 }} class="previous" type="button" onClick={ev => previous()}>PREVIOUS</button>
        <button style={{ borderRadius: 10 }} class="next" type="button" onClick={ev => next()}>NEXT</button>
      </div>

      <div className='AdminCalendar'>
        <DayPilotScheduler
          {...events}
          ref={timesheetRef}
        />
      </div>
    </div >
  );
}
export default Admincalendar;