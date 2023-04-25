import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from 'react-csv';
import Select from 'react-select';
import "./EmployeeHours.css";

function App() {
  const [Userdata, setUserdata] = useState([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  const options = users.map(user => ({value: user.id, label: user.name}));

  useEffect(() => {
    fetch("http://127.0.0.1:7000/attendance/showemp")
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setUsers(data);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const handleEmpIdChange = (selectedOption) => {
    setSelectedId(selectedOption);
  };

  const handleMonthYearChange = (date) => {
    setSelectedMonthYear(date);
    if (date) {
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setDay(date.getDate());
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    } else {
      setDay(null);
      setMonth(null);
      setYear(null);
    }
  };

  useEffect(() => {
    const getuserdata = async () => {
      fetch("http://127.0.0.1:7000/attendance/Employeehours", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: day,
          month: month,
          year: year,
          id: selectedId.value
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserdata(data);
        });
    };
    getuserdata();
  }, [day, month, year, selectedId]);


  function refreshPage() {
    {
       window.location.reload();
     }
 }

  return (
    <body className="EmployeeHours">
    <div>
      <br/><br/>
      <div className="container" style={{ textAlign: "center", marginTop: '5px',border:"none"}}>
        <div className="monthyear">
          <label htmlFor="id">Employee Id & Name:</label>
          <Select
            value={selectedId}
            onChange={handleEmpIdChange}
            options={options}
          />

          <label htmlFor="date">Select Month & Year:</label>
          <DatePicker
            selected={selectedMonthYear}
            onChange={handleMonthYearChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />
        </div>
        <div className="daymonthyear">
          <label htmlFor="date">Select Date:</label>
          <DatePicker
          style={{ fontWeight: "bold" }}
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
          />
          <br />
           {day && <p style={{ fontWeight: "bold" }}>Day: {day}</p>}
        {month && <p style={{ fontWeight: "bold" }}>Month: {month}</p>}
        {year && <p style={{ fontWeight: "bold" }}>year: {year}</p>}
        </div>
      </div>

      <div className="download-csv3">
        <div className="button">
            <CSVLink data={Userdata} onClick= {() => {refreshPage();}} filename={"latelogin & earlylogout details"} title="Download CSV">
            {/* <div class="text">Download</div> */}
              <span>
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" height="3em" width="3em" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none"></path>
                </svg>
              </span>
            </CSVLink>
        </div>
      </div>
      </div>
      </body>
  );
}
export default App;