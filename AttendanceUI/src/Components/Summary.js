import React, { useState, useEffect } from "react";
import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import "./Summary.css";
import "react-datepicker/dist/react-datepicker.css";
import { Container } from 'react-bootstrap'
function MyComponent() {
    const [userdata, setUserdata] = useState([]);
    const [myMonth, setMyMonth] = useState(new Date());
    const [myYear, setMyYear] = useState(new Date());
    const [myDay, setMyDay] = useState(new Date());
    const newDate = new Date();
    const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
    const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);
    const departments = ["IT" ,"DOCTOR","NURSE","HR", "LAB", "RT TECH","PHARMACY","TELECALLER","FRONT OFFICE","SECURITY","ELECTRICIAN","ACCOUNTS","NURSING","HOUSE KEEPING","DENSIST CONSULTANT","COOK"];
    const [selectedDepartment, setSelectedDepartment] = useState("");
    function handleChange(e) {
        setSelectedDepartment(e.currentTarget.value);
        console.log("e.currentTarget.value",e.currentTarget.value);
        console.log("test:",selectedDepartment);
      }
    useEffect(() => {
        console.log(selectedDepartment);
        const getuserdata = async () => {
            fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    month: myMonth.getMonth() + 1,
                    year: myYear.getFullYear(),
                    department:selectedDepartment
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setUserdata(data);
                });
        };
        getuserdata();
    }, [myMonth, myYear,selectedDepartment]);
    useEffect(() => {
        setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
    }, [myMonth, myYear, setMyDay]);
    const renderDayContents = (day, date) => {
        if (date < minDate || date > maxDate) {
            return <span></span>;
        }
        return <span>{date.getDate()}</span>;
    };
    // render the component
    return (
        // <div class="card">
        <div>
            <div >
                <div style={{ textAlign: "center", marginTop: '150px', fontSize: "150px" }}>
                    <div class="date-picker" style={{ display: "inline-block", cursor: "pointer", marginRight: "0px", fontSize: "30px", color: "red", marginTop: "180px" }}>
                        <label>Year</label>
                        <DatePicker
                            style={{ textAlign: "center" }}
                            selected={myYear}
                            onChange={(date) => setMyYear(date)}
                            renderCustomHeader={({ date }) => <div></div>}
                            showYearPicker
                            dateFormat="yyyy"
                            placeholderText=""
                        />
                    </div>
                    <div class="date-picker" style={{ display: "inline-block", cursor: "pointer", fontSize: "30px", color: "red" }}>
                        <label>Month</label>
                        <DatePicker
                            selected={myMonth}
                            onChange={(date) => setMyMonth(date)}
                            showMonthYearPicker
                            dateFormat="MMMM"
                            renderCustomHeader={({ date }) => <div></div>}
                            placeholderText=""
                        />
                    </div>
                    <div className="download-csv1">
                        <div class="button">
                            <div class="button-wrapper">
                                <CSVLink data={userdata} filename={"payroll"} title="Download CSV">
                                    {/* <div class="text">Download</div> */}
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
            <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Department</div></label>
                <div className="col-sm-7">
                  <select className="w-50 mx-4" form-control style={{ borderRadius: 40 }} value={selectedDepartment} onChange={handleChange}>
                  <option style={{textAlign:"center"}} value="" disabled>Select department</option>
                  {departments.map((department, index) => (
                    <option style={{textAlign:"center"}} key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
            </div>
          </div>
        </div>
    );
}
export default MyComponent;
