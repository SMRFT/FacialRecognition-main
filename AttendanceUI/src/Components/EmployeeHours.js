import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from 'react-csv';
function App() {
  const [Userdata,setUserdata]=useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [empId, setEmpId] = useState("");
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setDay(date.getDate());
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    }
  };
  const handleEmpIdChange = (event) => {
    setEmpId(event.target.value);
  }
  useEffect(() => {
    const getuserdata = async () => {
      fetch("http://127.0.0.1:7000/attendance/Employeehours", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: day,
          month: month,
          year: year,
          id: empId
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserdata(data);
        });
    };
    getuserdata();
  }, [day,month,year,empId]);
  return (
    <div>
      <div>
      <label htmlFor="empId">EmpId:</label>
<input type="text" id="empId" value={empId} onChange={handleEmpIdChange} />
<br />
<br />
        <div>
          Select Date
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
        />
        <br />
        <br />
        <div>Day: {day}</div>
        <div>Month: {month}</div>
        <div>Year: {year}</div>
        <br />
      </div>
      <div className="download-csv1">
        <div class="button">
          <div class="button-wrapper">
            <CSVLink data={Userdata} filename={"latelogindetails"} title="Download CSV">
              <span class="icon">
                <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" height="2em" width="2em" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" fill="none"></path>
                </svg>
              </span>
            </CSVLink>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
export default App;