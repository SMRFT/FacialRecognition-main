import React, { useState, useEffect,useCallback } from "react";
import * as ReactBootStrap from "react-bootstrap";
import Pagination from "react-js-pagination";
import Footer from './Footer';
const Breakdetails = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, setUsers] = useState({ blogs: [] });
  // fetch the data from the server and update the state
  const breakData = useCallback(() => {
    fetch("http://127.0.0.1:7000/attendance/breakdetails")
      .then((res) => res.json())
      .then(
        (data) => {
          setIsLoaded(true);
          setUsers({ blogs: data });
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);
  // Call the breakData function when the component mounts
  useEffect(() => {
    breakData();
  }, [breakData]);
   ///search employee for searching employee information by id,name,number,designation, or department
   const [searchString, setSearchString] = useState("");
   const filteredResults = users.blogs.filter((singleEmpObject) => {
     return Object.values(singleEmpObject).some((val) =>
       val
         .toString()
         .toLowerCase()
         .includes(searchString.toString().toLowerCase())
     );
   });
   // State to keep track of the current page
   const [activePage, setActivePage] = useState(1);
   // Function to handle page change
   const handlePageChange = (pageNumber) => {
     setActivePage(pageNumber);
   };
   // Number of items to show per page
   const ITEMS_PER_PAGE = 5;
   // Get the index of the first and last items to show on the current page
   const indexOfLastItem = activePage * ITEMS_PER_PAGE;
   const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
   // Slice the filtered results to show only the items for the current page
   const paginatedResults = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
    return (
      <body>
        <br /><br/>
        <div className="table">
          <ReactBootStrap.Table
            striped
            bordered="danger"
            borderColor="danger"
            borderless hover 
          >
            <thead align="center">
              <tr style={{backgroundColor: "#E0FFFF"}}>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Employee Id</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Name</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Department</b>
                  </div>
                </th>
                <th>
                  <div
                    style={{
                      color: "seagreen",
                      fontFamily: "-moz-initial",
                      fontSize: "18px",
                    }}
                  >
                    <b>Designation</b>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody align="center">
            {paginatedResults.map((user, index) => (
                <tr style={{backgroundColor: "#E0FFFF"}}key={user.id}>
                  <td>{user.id}</td>
                  <td><div style={{ display: "flex", alignItems: "center" }}><img src={`http://localhost:7000${user.imgSrc}`} width="80" height="80" className="rounded-circle" />
                    <div style={{ marginLeft: "20px" }}>{user.name}</div>
                  </div>
                  </td>
                  <td>{user.department}</td>
                  <td>{user.designation}</td>
                </tr>
              ))}
            </tbody>
          </ReactBootStrap.Table>
          <div className="pagination-container">
          <Pagination
                activePage={activePage}
                itemsCountPerPage={ITEMS_PER_PAGE}
                totalItemsCount={filteredResults.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText="Prev"
                nextPageText="Next"
              />
          </div>
      </div>
      <Footer />
    </body>
  );
};
export default Breakdetails;  