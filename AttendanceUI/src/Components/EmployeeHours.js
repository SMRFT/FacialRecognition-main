import React, { useState,useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Summary.css";
import Footer from './Footer';
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
    
    <div   style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" ,marginTop:"-11%"}}>
    <div class="shadow-effect" style={{ backgroundColor: "#E0FFFF", padding: "20px", borderRadius: "10px", maxWidth: '600px', width: '100%'}}>
      <div className="datepicker-container" style={{ textAlign: "center", marginTop: '20px', fontSize: "20px" ,color:"seagreen"}}>
        <div>Employee Id:</div>
        <div><input className="rounded" type="text" id="empId" value={empId} onChange={handleEmpIdChange} /></div>
      </div>
      <div className="datepicker-container">
        <div  style={{ textAlign: "center",color:"seagreen" }}>Select Date:</div>
        <DatePicker
         className="rounded"
          style={{ textAlign: "center" }}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
        />
        <br/>
        <br/>
        {day && <p style={{ fontWeight: "bold", marginLeft: "30px" ,color:"Green" }}>Day: {day}</p>}
        {month && <p style={{ fontWeight: "bold", marginLeft: "30px",color:"Green"  }}>Month: {month}</p>}
        {year && <p style={{ fontWeight: "bold", marginLeft: "30px",color:"Green"  }}>year: {year}</p>}
      </div>
   
      <div style={{marginLeft: "40%",marginTop:"-0.3%"}}className="download-csv1">
        <div class="button">
          <div class="button-wrapper">
          <div class="text">Download</div>
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
    <Footer />
  </div>
  
  );
}
export default App;