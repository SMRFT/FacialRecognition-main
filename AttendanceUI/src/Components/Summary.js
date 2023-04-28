import React, { useState, useEffect } from "react";
import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import "./Summary.css";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
// import 'react-datepicker/dist/react-datepicker.css';
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
    const [startDate, setStartDate] = useState(new Date());
    function handleChange(e, selectedDate) {
        setSelectedDepartment(e.target.value);
        setStartDate(selectedDate);
        console.log("Selected department:", e.target.value);
        console.log("Selected date:", selectedDate);
      }
      useEffect(() => {
        const getuserdata = async () => {
          fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              month: startDate.getMonth() + 1,
              year: startDate.getFullYear(),
              department: selectedDepartment,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setUserdata(data);
            });
        };
        getuserdata();
      }, [startDate, selectedDepartment]);
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
        <div>
            <div >
                <div style={{ textAlign: "center", marginTop: '5px'}}>
                <div class="date-picker" >
                        <label style={{fontSize: "20px"}}>Select Month and year</label>
                        <div  style={{ marginLeft:"10px", cursor: "pointer", fontSize: "10px"}}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                        />
                    </div>
                    </div>
                    <br/>
                    <div className="mb-3">
                        <label className="mx-3 form-label"><div className="form-control-label" style={{ display: "inline-block", cursor: "pointer", fontSize: "20px"}}>Select Department</div></label>
                        <div className="col-sm-12">
                        <select className="w-28" style={{ borderRadius: 60 }} value={selectedDepartment} onChange={(e) => handleChange(e, startDate)}>
                        <option style={{textAlign:"center"}} value="" disabled>Select department</option>
                        {departments.map((department, index) => (
                            <option style={{textAlign:"center"}} key={index} value={department}>
                            {department}
                            </option>
                        ))}
                        </select>
                    </div>
                  </div>
                  <CSVLink data={userdata} filename={"payroll"} title="Download CSV">
  <CloudDownloadIcon style={{ fontSize: 50 }} />
</CSVLink>

                </div>
            </div>
        </div>
    );
}
export default MyComponent;