import { useState } from 'react';
import axios from 'axios';
import React, { useEffect, useCallback } from "react";
import { Navbar, Nav } from 'react-bootstrap';
import Viewemp from './Viewemp';
import Addemp from './Addemp';
import Dashboard from './Dashboard';
import Summary from './Summary';
import EmployeeHours from './EmployeeHours';
import AdminReg from '../Adminreg';
import Deleteemp from './Deleteemp';
import profile from "../images/smrft(1).png";
import './NavbarComp.css';
import { useNavigate } from "react-router-dom";
import "./Fileviewer.css";
import { CSVLink } from 'react-csv';
import "./NavbarComp.css";
import Footer from './Footer';
import EditForm from "./EditForm";
import DatePicker from "react-datepicker";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import moment from 'moment';

function DownloadButton(props) {
    // Set up state variables
    const [isLoading, setIsLoading] = useState(false);
    const [activeIcon, setActiveIcon] = useState("");
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [message, setMessage] = useState("");

    // Get the name parameter from the URL
    const params = useParams();
    const name = params.name;
    const sub = name.split('_');
    const id = sub[1]
    const name1 = sub[0]

    // Close the iframe
    const closeIframe = () => {
        setIsIframeVisible(false);
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.remove();
        }
      };

        // Function to close the previously clicked icon's content
        const closePreviousContent = () => {
            if (activeIcon !== "proof" && activeIcon !== "certificates") {
            if (activeIcon === "summary") {
                toggleSummaryPicker(); // close summary content
            } else if (activeIcon === "attendance") {
                toggleAttendancePicker(); // close attendance content
            } else if (activeIcon === "overtime") {
                toggleOvertimePicker(); // close overtime content
            } else if (activeIcon === "table") {
                toggleTables(); // close Table content
            }
            }
        };
         // Click event handler for the proof icon
         const handleProofIconClick = () => {
            closePreviousContent(); // close previous content
            setActiveIcon("proof"); // set active icon
            viewFile1(); 
            closeIframe(); 
            };

        // Click event handler for the certificates icon
        const handleCertificatesIconClick = () => {
            closePreviousContent(); 
            setActiveIcon("certificates"); 
            viewFile(); 
            closeIframe(); 
            };
  
        // Click event handler for the summary icon
        const handleSummaryIconClick = () => {
        closePreviousContent(); 
        setActiveIcon("summary"); 
        toggleSummaryPicker(); 
        closeIframe(); 
        };

        // Click event handler for the attendance icon
        const handleAttendanceIconClick = () => {
        closePreviousContent();
        setActiveIcon("attendance"); 
        toggleAttendancePicker(); 
        closeIframe(); 
        };

        // Click event handler for the overtime icon
        const handleOvertimeIconClick = () => {
        closePreviousContent(); 
        setActiveIcon("overtime"); 
        toggleOvertimePicker(); 
        closeIframe(); 
        };

        // Click event handler for the employee details icon
        const handleTableIconClick = () => {
            closePreviousContent(); // close previous content
            setActiveIcon("table"); // set active icon
            toggleTables(); // open overtime content
            closeIframe(); // close the iframe
            };

    // Click event handler for the editform icon
        const handleEditIconClick = () => {
            closePreviousContent(); 
            setActiveIcon("edit"); 
            setShowEditForm(!showEditForm);
            closeIframe(); 
            }
    
     //View the file in an iframe when the View button is clicked
     const viewFile1 = () => {
          setIsLoading(true);
          const queryParams = new URLSearchParams();
      
          // Make a POST request to the server to get the file as a blob
          axios
            .post(
              `http://localhost:7000/attendance/get_file?filename=${name}_proof.pdf`,
              {
                filename: `${name}_proof.pdf`,
              },
              {
                responseType: "blob",
              }
            )
            .then((response) => {
              // Remove the previously created iframe, if it exists
              const oldIframe = document.querySelector("iframe");
              if (oldIframe) {
                oldIframe.remove();
              }
              // Create a new iframe and set its source to the blob URL
              const file = new Blob([response.data], { type: "application/pdf" });
              const fileURL = URL.createObjectURL(file);
              const iframe = document.createElement("iframe");
              iframe.src = fileURL;
              iframe.style.width = "100%";
              iframe.style.height = `${window.innerHeight}px`;
              document.body.appendChild(iframe);
              setIsLoading(false);
              setIsIframeVisible(true);
            })
            .catch((error) => {
              console.error(error);
              setIsLoading(false);
              setMessage(
                error.response && error.response.status === 404
                  ? "File not found."
                  : "An error occurred while retrieving the file."
              );
            });
      };
    // View the file in an iframe when the View button is clicked
    const viewFile = () => {
        setIsLoading(true);
        const queryParams = new URLSearchParams();

        // Make a POST request to the server to get the file as a blob
        axios.post(`http://localhost:7000/attendance/get_file?filename=${name}_certificate.pdf`, {
            filename: `${name}_certificate.pdf`,
        }, {
            responseType: "blob"
        })
            .then(response => {
                // Remove the previously created iframe, if it exists
                const oldIframe = document.querySelector('iframe');
                if (oldIframe) {
                    oldIframe.remove();
                }
                // Create a new iframe and set its source to the blob URL
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                const iframe = document.createElement('iframe');
                iframe.src = fileURL;
                iframe.style.width = '100%';
                iframe.style.height = `${window.innerHeight}px`;
                document.body.appendChild(iframe);
                setIsLoading(false);
                setIsIframeVisible(true);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
                setMessage(
                    error.response && error.response.status === 404
                        ? "File not found."
                        : "An error occurred while retrieving the file."
                );
            });
    };
      
    const [educationData, setEducationData] = useState([]);
    const [experienceData, setExperienceData] = useState(null);
    const [referenceData, setReferenceData] = useState(null);
    const [showTables, setShowTables] = useState(false);

    const toggleTables = () => {
        setShowTables(!showTables);
        closeIframe(); // or closeIframe1()
    };

    const [employee, setEmployee] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();
    //Navigate to Calendar
    const navigateToCalendar = () => {
        navigate(`/AdminCalendar/${employee.name + '_' + employee.id}`)
        closeIframe();
    };
      
    useEffect(() => {
        const apiUrl = `http://127.0.0.1:7000/attendance/showemp?id=${id}`;
        fetch(apiUrl)
            .then((res) => res.json())
            .then(
                (data) => {
                    setEmployee(data);
                    setEducationData(JSON.parse(data.educationData));
                    setExperienceData(JSON.parse(data.experienceData));
                    setReferenceData(JSON.parse(data.referenceData));
                },
                (error) => {
                    console.error(error);
                }
            );
    }, [id]);

    const [showSummaryPicker, setShowSummaryPicker] = useState(false);
    const [showAttendancePicker, setShowAttendancePicker] = useState(false);
    const [showOvertimePicker, setShowOvertimePicker] = useState(false);
    const [userdata, setUserdata] = useState([]);
    const [myMonth, setMyMonth] = useState(new Date());
    const [myYear, setMyYear] = useState(new Date());
    const [myDay, setMyDay] = useState(new Date());
    const newDate = new Date();
    const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
    const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);
    const [showTable, setShowTable] = useState(false);
    const [showAttendanceTable, setShowAttendanceTable] = useState(false);
    const [showOvertimeTable, setShowOvertimeTable] = useState(false);

    const toggleSummaryPicker = () => {
        setShowSummaryPicker(!showSummaryPicker);
        closeIframe();
      };

      const toggleAttendancePicker = () => {
        setShowAttendancePicker(!showAttendancePicker);
        closeIframe();
      };

      const toggleOvertimePicker = () => {
        setShowOvertimePicker(!showOvertimePicker);
        closeIframe();
      };

      const handleSummaryClick = () => {
        setShowTable(!showTable);
        closeIframe();
      };    

      const handleOvertimeClick = () => {
        setShowOvertimeTable(!showOvertimeTable);
        closeIframe();
      };   

      const handleAttendanceClick = () => {
        setShowAttendanceTable(!showAttendanceTable);
        closeIframe();
      }; 
  
    useEffect(() => {
        const getuserdata = async () => {
          fetch("http://127.0.0.1:7000/attendance/EmployeeExport", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: id,
              month: myDay.getMonth() + 1,
              year: myDay.getFullYear(),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setUserdata(data);
            });
        };
        getuserdata();
      }, [myDay]);
    useEffect(() => {
        setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
    }, [myMonth, myYear, setMyDay]);
    const renderDayContents = (day, date) => {
        if (date < minDate || date > maxDate) {
            return <span></span>;
        }
        return <span>{date.getDate()}</span>;
    };

    const [userexportdata, setExportdata] = useState([]);
    useEffect(() => {
        const getexportdata = async () => {
          fetch("http://127.0.0.1:7000/attendance/EmployeeSummaryExport", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              month: myDay.getMonth() + 1,
              year: myDay.getFullYear(),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setExportdata(data);
              console.log(userexportdata)
            });
        };
        getexportdata();
      }, [myDay]);
    useEffect(() => {
        setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
    }, [myMonth, myYear, setMyDay]);
    const renderExportContents = (day, date) => {
        if (date < minDate || date > maxDate) {
            return <span></span>;
        }
        return <span>{date.getDate()}</span>;
    };

    // fetch the data from the server and update the state
const [breakusers, setBreakusers] = useState([]);
const [employeesOnBreak, setEmployeesOnBreak] = useState([]);
const [employeesActive, setEmployeesActive] = useState([]);
const [employeesNotActive, setEmployeesNotActive] = useState([]);
const [error, setError] = useState(null);
const [isLoaded, setIsLoaded] = useState(false);

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

let [ state, setState] = useState("");
state = {
    activeLink: '',
  };
  const handleNavItemClick = (linkName) => {
    setState({ activeLink: linkName });
  };

    return (
        <React.Fragment>
        <div className="wrapper">
        <div className="sidenav" style={{height: '100%',width: '14%',position: 'fixed',zIndex: 1,top: 0,left: 0,backgroundColor: '#232323',
        transition: '.5s ease',overflowX: 'hidden',paddingTop: '1%',display: 'flex',flexDirection: 'column',alignItems: 'center',
        }}>
            <div className="sidebar-wrapper">
              <div className="sidebar-menu">
              <div className='logo'>
                <img src={profile} className="smrft_logo" alt="logo" />
              </div><br/>
                <ul className="sidebar-nav">
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/" className={`nav_link1 ${state.activeLink === 'home' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('home')}
                    >Home</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Viewemp" className={`nav_link2 ${state.activeLink === 'employeedetails' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('employeedetails')}
                    >Employee</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Addemp" className={`nav_link3 ${state.activeLink === 'addemployee' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('addemployee')}
                    >Add Employee</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Summary" className={`nav_link5 ${state.activeLink === 'Summary' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('Summary')}
                    > Summary</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Dashboard" className={`nav_link4 ${state.activeLink === 'dashboard' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('dashboard')}
                    > Dashboard</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/EmployeeHours" className={`nav_link6 ${state.activeLink === 'EmployeeHours' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('EmployeeHours')}
                    >EmployeeHours</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/Deleteemp" className={`nav_link8 ${state.activeLink === 'Deleteemp' ? 'active' : ''}`}
                      onClick={() => handleNavItemClick('Deleteemp')}
                    >Pending Approvals</Nav.Link>
                  </li>
                  <li className="sidebar-nav-item">
                    <Nav.Link as={Link} to="/Admin/AdminReg" className={`nav_link8 ${state.activeLink === 'AdminReg' ? 'active' : ''}`}onClick={() => handleNavItemClick('AdminReg')}
                    >Admin</Nav.Link>
                  </li>
                </ul>
                </div>
            </div>
        </div>
            <main>
            <Routes>
                <Route exact path='/Viewemp' element={<Viewemp />} ></Route>
                <Route exact path='/Addemp' element={<Addemp />} ></Route>
                <Route exact path='/Dashboard' element={<Dashboard />} ></Route>
                <Route exact path='/Summary' element={<Summary />} ></Route>
                <Route exact path='/EmployeeHours' element={<EmployeeHours/>} ></Route>   
                <Route exact path='/Deleteemp' element={<Deleteemp/>} ></Route>
                <Route exact path='/AdminReg' element={<AdminReg/>} ></Route>
            </Routes>
            </main>
        </div>
        
            <div className='normal-container' style={{ display: 'flex', flexDirection: 'column' }}>
            <img style={{ width:"2.3cm",height:"2.3cm",borderRadius:60,marginLeft:"20px", marginTop: "30px"}}
                src={`http://localhost:7000/attendance/profile_image?profile_picture_id=${employee?.profile_picture_id}`}
                alt="profile"
            />    
            {employee && (
                <div style={{ position: "relative" }}>
                    <div>
                    <div className="employee-name">{employee.name}</div>
                    <div className='id'>Employee Id</div><div className="employee-id">{employee.id}</div>
                    <div className='department'>Department</div><div className="employee-department">{employee.department}</div>
                    </div>
                    <div style={{ float: "right", marginRight:"20%",marginTop:"-7.5%"}}>
                    {employeesOnBreak.some((breakUser) => breakUser.id === employee.id) ? (
                        <button className="break-btn">Break</button>
                    ) : employeesActive.some((activeUser) => activeUser.id === employee.id) ? (
                        <button className="active-btn">Active</button>
                    ) : (
                        <button className="not-active-btn">Not Active</button>
                    )}
                    </div>
                    <button
                    style={{ color: "teal", marginRight:"5%", float:"right",marginTop: "-85px", fontSize: "16px", 
                    borderColor: "darkcyan", width: '3cm', height: "40px", backgroundColor: "white",borderRadius: 10 }}
                    onClick={() => {handleEditIconClick();setEditMode(!editMode)}}
                    data-toggle="modal"
                    >
                    {editMode ? "Close" : "Edit Details"}
                    </button>
                </div>
                )}
                {editMode && (
                    <br/>
                )}

            </div>
            <br/><br/>
            {showEditForm && employee && ( // Show EditForm component if showEditForm is true
                <EditForm theuser={employee} toggleForm={handleEditIconClick} />
            )}
             
            <div className="icon-container">
                <div style={{marginLeft:'5%',marginTop:"10%",color:'red'}} className="message">
                    {message ? <p>{message}</p> : null}
                </div>
                <a onClick={() =>{handleTableIconClick();closeIframe();}} className="view-link" style={{ marginLeft: '5px',marginTop:"1%",cursor: "pointer"}} >
                <i style={{fontSize:"45px",color:"darkolivegreen"}} className="bi bi-person-lines-fill"></i>
                {showTables ? "" : ""} 
                </a>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-75px',marginTop:"80px"}}>Employee Details</div>
                <div className="divider"></div>
                <a onClick={handleProofIconClick} className="view-link" style={{marginLeft: '5px',marginTop:"1%",cursor: "pointer"}} disabled={isLoading}>
                   {isLoading && activeIcon === "proof" ? <i style={{fontSize:"30px",fontWeight:"bold"}} className="fas fa-spinner fa-pulse"></i> : <i style={{fontSize:"40px",color:"darkred"}} className="bi bi-filetype-pdf"></i>}
                </a>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-40px',marginTop:"80px"}}>Proof</div>
                <div className="divider"></div>
                <a onClick={handleCertificatesIconClick} className="view-link" disabled={isLoading} style={{ marginLeft: '5px',marginTop:"1%",cursor: "pointer" }}>
                    {isLoading && activeIcon === "certificates" ? <i style={{fontSize:"30px",fontWeight:"bold"}} className="fas fa-spinner fa-pulse"></i> : <i style={{fontSize:"40px",color:"darkred"}} className="bi bi-filetype-pdf"></i>}
                </a>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-55px',marginTop:"80px"}}>Certificates</div>  
                <div className="divider"></div>
                <i  onClick={() => {navigateToCalendar(employee);closeIframe();}} style={{fontSize:"40px",color:"darkblue",marginTop:"1%",cursor:"pointer"}} className="bi bi-calendar-week"></i>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-45px',marginTop:"80px"}}>Calendar</div>
                <div className="divider"></div>
                <i onClick={() => {handleSummaryIconClick();closeIframe();}} className="bi bi-journal-text" style={{fontSize:"40px",color:"darkmagenta",marginTop:"1%",cursor:"pointer"}}></i>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-50px',marginTop:"80px"}}>Summary</div> 
                <div className="divider"></div>
                <i onClick={() => {handleAttendanceIconClick();closeIframe();}} style={{fontSize:"50px",color:"darkslategrey",marginTop:"0.5%",marginLeft: '5px',cursor:"pointer"}} className="bi bi-person-check-fill"></i>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-60px',marginTop:"80px"}}>Attendance</div>
                <div className="divider"></div>
                <i onClick={() => {handleOvertimeIconClick();closeIframe();}} style={{fontSize:"40px",color:"darkslateblue",marginTop:"1%",cursor:"pointer"}} className="bi bi-calendar-plus"></i>
                <div style={{fontSize:"14px",color:"gray",marginLeft: '-50px',marginTop:"80px"}}>Over Time</div>
            </div>

                {showSummaryPicker && (
                 <div className='summary-container'>
                <div style={{fontFamily:"-moz-initial",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Summary Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 /><br/>
                 <div style={{marginLeft:'5%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handleSummaryClick}>View</button>
                 </div>
                 <div style={{marginLeft:'55%',marginTop:"-24%"}}>
                    <button title="Download CSV" style={{backgroundColor:"powderblue",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}}>
                    <CSVLink style={{fontSize:'30px',color:"white",fontWeight:"bold",textAlign:"center"}} className="bi bi-download" data={userdata} filename={name1}></CSVLink></button>
                    </div>
               </div>
                )}
                {showTable && (
                <div className='summary-table-container'>
                    <table>
                    <thead style={{fontSize:"15px"}} >
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Month</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Shift</th>
                        <th>Worked Hours</th>
                        <th>Break Hours</th>
                        <th>Overtime Hours</th>
                        <th>Total Hours Worked</th>
                        <th>Leave Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userdata.map((data) => (
                        <tr style={{fontSize:"15px"}} key={data.id}>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize:"15px" }}>{data.id}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.name}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.date}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.month}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.start.substring(11, 16)}</td> {/* Extract time from datetime string */}
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.end.substring(11, 16)}</td> {/* Extract time from datetime string */}
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.shift}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.workedhours}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.breakhour}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.overtimehours}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.Total_hours_worked}</td>
                            <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{data.leavetype}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}

                {showAttendancePicker && (
                 <div className='attendance-container'>
                 <div style={{fontFamily:"-moz-initial",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Attendance Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 />
                 <div style={{marginLeft:'35%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handleAttendanceClick}>View</button>
                 </div>
                 </div>
                 )}
                {showAttendanceTable && (
                <div className='attendance-table-container'>
                    <table>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Month</th>
                        <th>Total Days In Month</th>
                        <th>Present Days</th>
                        <th>CL Taken</th>
                        <th>SL Taken</th>
                        <th>Remaining week0ff</th>
                        <th>Absent Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userexportdata.map((data) => {
                        // Specify the ID for which you want to display the attendance report
                        const targetId = id;
                        // Display the attendance report only for the specified ID
                        if (data.id === targetId) {
                            return (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.month}</td>
                                <td>{data.Days_in_a_month}</td>
                                <td>{data.workingdays}</td>
                                <td>{data.CL_Taken}</td>
                                <td>{data.SL_Taken}</td>
                                <td>{data.remaining_weekoff}</td>
                                <td>{data.loss_of_pay}</td>
                            </tr>
                            );
                        }
                        return null; // Skip rendering for other IDs
                        })}
                    </tbody>
                    </table>
                </div>
                )}

                {showOvertimePicker && (
                 <div className='overtime-container'>
                <div style={{fontFamily:"-moz-initial",fontSize:"25px",color:"darkcyan",whiteSpace:"nowrap"}}>Overtime Report</div><br/>
                 <DatePicker
                   selected={myDay}
                   onChange={(date) => setMyDay(date)}
                   dateFormat='MM/yyyy'
                   showMonthYearPicker
                 />
                 <div style={{marginLeft:'30%',marginTop:"10%"}}>
                   <button style={{backgroundColor:"powderblue",fontWeight:"bold",width:'2cm',height:"1.1cm",borderColor:"powderblue",borderRadius: 10,color:"white"}} 
                   onClick={handleOvertimeClick}>View</button>
                 </div>
                 </div>
                 )}
                 {showOvertimeTable && (
                <div className='overtime-table-container'>
                    {userdata.filter((data) => {
                    const overtime = moment.duration(data.overtimehours).asHours();
                    return overtime > 0;
                    }).length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Month</th>
                            <th>Overtime Hours</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userdata.map((data) => {
                            const overtime = moment.duration(data.overtimehours).asHours();
                            if (overtime > 0) {
                            return (
                                <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.date}</td>
                                <td>{data.month}</td>
                                <td>{data.overtimehours}</td>
                                </tr>
                            );
                            } else {
                            return null;
                            }
                        })}
                        </tbody>
                    </table>
                    ) : (
                    <p style={{marginLeft:"-18%"}}>No overtime done.</p>
                    )}
                </div>
                )}

                <div >    
                {showTables && (
                <>
                <div style={{fontFamily:"-moz-initial",fontSize:"25px",color:"darkcyan",marginLeft:"38%"}}>{employee.name}'s Details</div><br/>
                <div style={{ display: "flex" }}>
                <div className="employee-details-container">
                <div className="details-row">
                    <div className="details-heading">Employee ID</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.id}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Mobile</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.mobile}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Email</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.email}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Department</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.department}</div>
                </div>
                {employee.department === "DOCTOR" && (
                    <div className="details-row">
                    <div className="details-heading">TNMCNO</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.TNMCNO}</div>
                    </div>
                )}
                {employee.department === "NURSE" && (
                    <React.Fragment>
                    <div className="details-row">
                        <div className="details-heading">RNRNO</div>
                        <div className="colon">:</div>
                        <div className="details-value">{employee.RNRNO}</div>
                    </div>
                    <div className="details-row">
                        <div className="details-heading">ValidityDate</div>
                        <div className="colon">:</div>
                        <div className="details-value">{employee.ValidlityDate}</div>
                    </div>
                    </React.Fragment>
                )}
                <div className="details-row">
                    <div className="details-heading">Designation</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.designation}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Gender</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.Gender}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Blood Group</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.BloodGroup}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Dob</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.dob.substring(4, 16)}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Maritalstatus</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.Maritalstatus}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Aadhaar Number</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.Aadhaarno}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Bank Account Number</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.bankaccnum}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Pan Number</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.PanNo}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Identification Mark</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.IdentificationMark}</div>
                </div>
                <div className="details-row">
                    <div className="details-heading">Languages Known</div>
                    <div className="colon">:</div>
                    <div className="details-value">{employee.languages}</div>
                </div>
                </div>
                        <div>
                        <caption style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Education Data</caption><br/>
                            {educationData ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>Degree</th>
                                            <th>Major</th>
                                            <th>Institution</th>
                                            <th>Marks</th>
                                            <th>Division</th>
                                            <th>Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {educationData.map((edu, index) => (
                                            <tr key={index}>
                                                <td>{edu.SlNo}</td>
                                                <td>{edu.degree}</td>
                                                <td>{edu.major}</td>
                                                <td>{edu.institution}</td>
                                                <td>{edu.marks}</td>
                                                <td>{edu.division}</td>
                                                <td>{edu.year}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No education data available</p>
                            )}
                        </div>
                        </div>

                        <div style={{ display: "flex",margin: '5%' ,marginTop:"-1%"}}>
                        <div>
                        <caption style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Experience Data</caption><br/>
                            {experienceData ? (
                                <table>
                                    <thead className='thead'>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>Organization</th>
                                            <th>Designation</th>
                                            <th>Last Drawn Salary</th>
                                            <th>Location</th>
                                            <th>Experience</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experienceData.map((exp, index) => (
                                            <tr key={index}>
                                                <td>{exp.SlNo}</td>
                                                <td>{exp.Organization}</td>
                                                <td>{exp.designation}</td>
                                                <td>{exp.lastdrawnsalary}</td>
                                                <td>{exp.location}</td>
                                                <td>{exp.experience}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No experience data available</p>
                            )}
                        </div>
                        <div style={{ marginLeft: '5%' }}>
                        <caption style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reference Data </caption><br/>
                            {referenceData ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SlNo</th>
                                            <th>References</th>
                                            <th>Organization</th>
                                            <th>Designation</th>
                                            <th>Contact No.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referenceData.map((ref, index) => (
                                            <tr key={index}>
                                                <td>{ref.SlNo}</td>
                                                <td>{ref.references}</td>
                                                <td>{ref.Organization}</td>
                                                <td>{ref.designation}</td>
                                                <td>{ref.ContactNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No reference data available</p>
                            )}
                        </div>
                        </div>
                    </>
                )}
            </div>
        {/* <Footer /> */}
        </React.Fragment >
    );
}
export default DownloadButton;