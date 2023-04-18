import React, { useEffect, useState } from "react";
import axios from "axios";
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
  
  // const deleteEmployee = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this employee?")) {
  //     try {
  //       await fetch(`http://127.0.0.1:7000/attendance/permanentdelete/${deletedEmployees.id}`, {
  //         method: "post",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //       });
  //       setDeletedEmployees(deletedEmployees.filter(employee => employee.id !== id));
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

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
      <h1>Deleted Employees</h1>
      <table striped borderless hover>
        <thead align="center">
          <tr style={{backgroundColor: "#E0FFFF"}}>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>deleted At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deletedEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.deleted_at}</td>
              <td>
<button onClick={() => deleteEmployee(employee.id)} style={{
    alignItems:"center",
    backgroundColor: "Red",
    color: "black",
    marginLeft:"10px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  }}>Delete Employee Permantly</button>

                <button onClick={() => restoreEmployee(employee.id)} style={{
    alignItems:"center",
    backgroundColor: "#90EE90",
    color: "black",
    marginLeft:"10px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer"
  }}>
    Restore
  </button>
              </td>
              

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrashPage;
