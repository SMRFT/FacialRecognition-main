import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
// import "./Viewemp.css";
const TrashPage = () => {
  const [deletedEmployees, setDeletedEmployees] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:7000/attendance/deleted-employees/")
      .then((res) => {
        setDeletedEmployees(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  

  const deleteEmployee = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await fetch("http://127.0.0.1:7000/attendance/permanentdelete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: id, // Use the id argument here
          }),
        });
        window.location.reload();
        // Update the deletedEmployees state or perform any other necessary actions
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const restoreEmployee = async (id) => {
    if (window.confirm("Are you sure you want to restore this employee?")) {
      try {
        await fetch(`http://127.0.0.1:7000/attendance/restore-employee/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: id }),
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };
  

  
  return (
    <div>
     <h1 style={{ marginLeft: "250px", color: "blue", fontSize: "30px" }}>
    Deleted Employees
  </h1>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px",marginLeft:"250px" }}>
      {deletedEmployees.map((employee) => (
        <div
          key={employee.id}
          style={{
            backgroundColor: "ghostwhite",
            borderRadius: "5px",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            padding: "20px",
            width: "300px",
            display: "flex",
            flexDirection: "column",
          }}
        >
     
         <img src={`http://localhost:7000/attendance/profile_image?profile_picture_id=${employee.profile_picture_id}`}   style={{
          display: "block",
          margin: "auto",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
        }} alt="Profile Picture" />
     
         <Card.Body>
          <h2 style={{ marginBottom: "10px" ,fontSize:"20px"}}>ID: {employee.id}</h2>
          <p style={{ marginBottom: "10px" }}>
            Name: {employee.name}
          </p>
          <p style={{ marginBottom: "10px" }}>
            Email: {employee.email}
          </p>
          <p style={{ marginBottom: "10px" }}>
            Department: {employee.department}
          </p>
          <p style={{ marginBottom: "10px" }}>
            Deleted At: {employee.deleted_at}
          </p>

          </Card.Body>
          <div style={{ marginTop: "auto" }}>
            <button
              onClick={() => deleteEmployee(employee.id)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Delete 
            </button>
            <button
              onClick={() => restoreEmployee(employee.id)}
              style={{
                backgroundColor: "#90EE90",
                color: "black",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Restore
            </button>
         
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default TrashPage;
