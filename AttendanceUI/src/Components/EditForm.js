import { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Modal,  Row, Col } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
//import { json } from "express";
const EditForm = ({ theuser }) => {
  const id = theuser.id;
  const [name, setname] = useState(theuser.name);
  const [mobile, setmobile] = useState(theuser.mobile);
  const [address, setaddress] = useState(theuser.address);
  const [Aadhaarno, setAadhaarno] = useState(theuser.Aadhaarno);
  const [designation, setdesignation] = useState(theuser.designation);
  const [email, setemail] = useState(theuser.email);
  const [PanNo, setPanNo] = useState(theuser.PanNo);
  const [RNRNO, setRNRNO] = useState(theuser.RNRNO);
  const [TNMCNO, setTNMCNO] = useState(theuser.TNMCNO);
  const [ValidlityDate, setValidlityDate] = useState(theuser. ValidlityDate);
  const [educationData, setEducationData] = useState(theuser. educationData);
  const [department, setdepartment] = useState(theuser.department
    );
  const [showTable, setShowTable] = useState(false);
  const [dataArray, setDataArray] = useState(JSON.parse(educationData));
  const { register,handleSubmit,formState: { errors } } = useForm();
  const handleInputChange = (e, rowIndex, fieldName) => {
    const updatedDataArray = [...dataArray];
    updatedDataArray[rowIndex][fieldName] = e.target.value;
    setDataArray(updatedDataArray);
  };
  function handleUpdateResponse(response) {
    if (response.ok) {
      alert("Employee data updated successfully!");
      window.location.reload();
    } else {
      throw new Error("Failed to update employee data.");
    }
  }
  // const [showTable, setShowTable] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  const handleViewTable = () => {
    if (dataArray && dataArray.length > 0) {
      setShowTable(true);
      setShowMessage(false);
    } else {
      setShowTable(false);
      setShowMessage(true);
    }
  };
  const handleHideTable = () => {
    setShowTable(false);
  };
  const editemp = async () => {
    try {
      const res = await fetch(`http://localhost:7000/attendance/editemp`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: theuser.id,
          name: theuser.name,
          mobile: theuser.mobile,
          address: theuser.address,
          designation: theuser.designation,
          department: theuser.department,
          email: theuser.email,
          Aadhaarno: theuser.Aadhaarno,
          PanNo: theuser.PanNo,
          RNRNO: theuser.RNRNO,
          TNMCNO: theuser.TNMCNO,
          ValidlityDate: theuser.ValidlityDate,
          educationData: JSON.stringify(dataArray)
        }),
      });
      handleUpdateResponse(res);
    } catch (error) {
      console.error(error);
    }
  };
  
  // const dataArray = JSON.parse(educationData);
    
  return (
    <div className="App">
      <Form onSubmit={handleSubmit(editemp)}>
      <Row>
      <Col>
        <Form.Group>
        <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text" 
            value={name} 
            placeholder="name"  
            onChange={(e) => setname(e.target.value)} 
            disabled/>
            <br/>
            <div style={{color:"red"}}>*This field not be editable</div>
          
        </Form.Group>
        </Col>
        <br/>
        <Col>
        <Form.Group>
        <Form.Label>Mobile:</Form.Label>
          <Form.Control
            type="text"
             value={mobile} 
             placeholder="mobile"
            {...register("mobile",
            {
              pattern: /^[0-9]{10}$/
            })}   
            onChange={(e) => setmobile(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.mobile && <p>*Please enter the valid mobile number</p>}</div>
        <br/>
        </Col>
        </Row>

        <Row>
      <Col>
        <Form.Group>
        <Form.Label>designation:</Form.Label>
          <Form.Control
            type="text" 
            value={designation} 
            placeholder="designation"
            {...register("designation", 
              { 
                pattern: /^[a-zA-Z ]*$/ 
            })} 
            onChange={(e) => setdesignation(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
          {errors.designation && <p>*Please check the designation</p>}</div>
        <br/>
        </Col>
        <Col>
        <Form.Group>
        <Form.Label>address:</Form.Label>
          <Form.Control
            as="textarea"
            type="text" 
            value={address} 
            placeholder="address" 
            {...register("address", 
            { 
              pattern:  /^[0-9/,a-zA-Z- 0-9.]*$/
            })}       
            onChange={(e) => setaddress(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.address && <p>*Please check the address</p>}
       </div>
       </Col>
        </Row>
        <br/>
        <Row>
      <Col>
        <Form.Group>
        <Form.Label>Department:</Form.Label>
          <Form.Control
            as="textarea"
            type="text" 
            value={department} 
            placeholder="department" 
            {...register("department", 
            { 
              pattern: /^[a-zA-Z ]*$/
            })}       
            onChange={(e) => setdepartment(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.department
 && <p>*Please check the Department</p>}
       </div>
       </Col>
       <br/>
       <Col>
       <Form.Group>
       <Form.Label>Email:</Form.Label>
          <Form.Control
            as="textarea"
            type="text" 
            value={email} 
            placeholder="email" 
            {...register("email", 
            { 
              pattern:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            })}       
            onChange={(e) => setemail(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.email
 && <p>*Please check the Email</p>}
       </div>
       <br/>
       </Col>
        </Row>
        <Row>
      <Col>
       <Form.Group>
       <Form.Label>Aadhaarno:</Form.Label>
          <Form.Control
            type="text" 
            value={Aadhaarno} 
            placeholder="Aadhaarno" 
            {...register("Aadhaarno", 
            { 
              pattern: /^[0-9]{12}$/
            })}       
            onChange={(e) => setAadhaarno(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.Aadhaarno
 && <p>*Please check the Aadhaarno </p>}
       </div>
       </Col>
       <br/>
       <Col>
       <Form.Group>
       <Form.Label>PanNo:</Form.Label>
          <Form.Control
            type="text" 
            value={PanNo} 
            placeholder="PanNo" 
            {...register("PanNo", 
            { 
              pattern:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
            })}       
            onChange={(e) => setPanNo(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.PanNo
 && <p>*Please check the PanNo </p>}
       </div>
       <br/>
       </Col>
        </Row>

       <br/>
       <Form.Group>
       <Button onClick={handleViewTable}>Educational Data</Button>
{showMessage && <div>No data to display.</div>}
{showTable && (
       <Table striped bordered hover  variant='dark'>
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
    {dataArray.map((data, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <Form.Control
            type="text"
            value={data.degree}
            onChange={(e) => handleInputChange(e, index, "degree")}
          />
        </td>
        <td>
          <Form.Control
            type="text"
            value={data.major}
            onChange={(e) => handleInputChange(e, index, "major")}
          />
        </td>
        <td>
          <Form.Control
            type="text"
            value={data.institution}
            onChange={(e) => handleInputChange(e, index, "institution")}
          />
        </td>
        <td>
          <Form.Control
            type="text"
            value={data.marks}
            onChange={(e) => handleInputChange(e, index, "marks")}
          />
        </td>
        <td>
          <Form.Control
            type="text"
            value={data.division}
            onChange={(e) => handleInputChange(e, index, "division")}
          />
        </td>
        <td>
          <Form.Control
            type="text"
            value={data.year}
            onChange={(e) => handleInputChange(e, index, "year")}
          />
        </td>
      </tr>
    ))}
  </tbody>
</Table>

)}
</Form.Group>
<br/>
<Row>
      <Col>
        <Form.Group>
        <Form.Label> RNRNO:</Form.Label>
          <Form.Control
            type="text" 
            value={ RNRNO} 
            placeholder=" RNRNO" 
            {...register(" RNRNO", 
            { 
              pattern: /^[0-9]{12}$/
            })}       
            onChange={(e) => setRNRNO(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors. RNRNO
 && <p>*Please check the  RNRNO </p>}
       </div>
       </Col>
       <br/>
       <Col>
       <Form.Group>
       <Form.Label>TNMCNO:</Form.Label>
          <Form.Control
            type="text" 
            value={TNMCNO} 
            placeholder="TNMCNO" 
            {...register("TNMCNO", 
            { 
              pattern: /^[0-9]{12}$/
            })}       
            onChange={(e) => setTNMCNO(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.TNMCNO
 && <p>*Please check the TNMCNO </p>}
       </div>
       </Col>
       <br/>
       <Col>
       <Form.Group>
       <Form.Label>ValidlityDate:</Form.Label>
          <Form.Control
            type="text" 
            value={ValidlityDate} 
            placeholder="ValidlityDate" 
            {...register("ValidlityDate", 
            { 
              pattern: /^[0-9]{12}$/
            })}       
            onChange={(e) => setValidlityDate(e.target.value)}/>
        </Form.Group>
        <div style={{color:"red"}}>
        {errors.ValidlityDate
 && <p>*Please check the ValidlityDate </p>}
       </div>
       </Col>
        </Row>
        <br/>
       <div style={{ display: "flex", justifyContent: "center" }}>
  <Button onClick={() => { handleSubmit(editemp); }} variant="success" type="submit" block>
    Save
  </Button>
</div>
{/* 
        <div style={{float:"right"}}>
        <Button onClick={() => {handleUpdateResponse();}}  variant="danger" type="submit" block>
          Close
        </Button>
        </div> */}
      </Form>
    </div>
  );
}
export default EditForm;