import { useState, useEffect} from 'react';
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Table from 'react-bootstrap/Table';
import VerticalTabs from "./VerticalTabs";

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
  const [department, setdepartment] = useState(theuser.department);
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
          id:id,
          name: name,
          mobile:mobile,
          address: address,
          designation: designation,
          department: department,
          email:email,
          Aadhaarno: Aadhaarno,
          PanNo: PanNo,
          RNRNO: RNRNO,
          TNMCNO: TNMCNO,
          ValidlityDate:ValidlityDate,
          educationData: JSON.stringify(dataArray)
        }),
      });
      handleUpdateResponse(res);
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    {
      title: "Personal Details",
      content: (
        <div>
          <Form.Group>
            <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Mobile</div>
            </Form.Label>
            <Form.Control 
              className="w-50 mx-4 form-control"
              type="text"
              value={mobile}
              placeholder="mobile"
              {...register("mobile", {
                pattern: /^[0-9]{10}$/
              })}
              onChange={(e) => setmobile(e.target.value)}
            />
          </Form.Group>
          <div style={{ color: "red" }}>
            {errors.mobile && <p>*Please enter the valid mobile number</p>}
          </div>
          <br />
          <Form.Group>
          <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Email</div>
            </Form.Label>
            <Form.Control
              className="w-50 mx-4 form-control"
              type="text"
              value={email}
              placeholder="email"
              {...register("email", {
                pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
              })}
              onChange={(e) => setemail(e.target.value)}
            />
          </Form.Group>
          <div style={{ color: "red" }}>
            {errors.email && <p>*Please check the Email</p>}
          </div>
          <br />
        <Form.Group>
        <Form.Label><div className="form-control-label text-muted" 
          style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Department</div>
        </Form.Label>
          <Form.Control
            className="w-50 mx-4 form-control"
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
        {errors.department && <p>*Please check the Department</p>}
       </div>
       <br/>
          <Form.Group>
          <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Designation</div>
          </Form.Label>
            <Form.Control 
              className="w-50 mx-4 form-control"
              type="text"
              value={designation}
              placeholder="designation"
              {...register("designation", {
                pattern: /^[a-zA-Z ]*$/
              })}
              onChange={(e) => setdesignation(e.target.value)}
            />
          </Form.Group>
          <div style={{ color: "red" }}>
            {errors.designation && <p>*Please check the designation</p>}
          </div>
          <br />
          <Form.Group>
          <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Address</div>
            </Form.Label>
            <Form.Control 
              className="w-50 mx-4 form-control"
              as="textarea"
              type="text"
              value={address}
              placeholder="address"
              {...register("address", {
                pattern: /^[0-9/,a-zA-Z- 0-9.]*$/
              })}
              onChange={(e) => setaddress(e.target.value)}
            />
          </Form.Group>
          <div style={{ color: "red" }}>
            {errors.address && <p>*Please check the address</p>}
          </div>
          <br />
          <Form.Group>
          <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Aadhaar No</div>
            </Form.Label>
            <Form.Control
              className="w-50 mx-4 form-control"
              type="text"
              value={Aadhaarno}
              placeholder="Aadhaar No"
              {...register("Aadhaarno", {
                pattern: /^[0-9]{12}$/
              })}
              onChange={(e) => setAadhaarno(e.target.value)}
            />
          </Form.Group>
          <div style={{ color: "red" }}>
            {errors.Aadhaarno && <p>*Please check the Aadhaar No</p>}
          </div>
          <br />
          <Form.Group>
          <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Pan No</div>
            </Form.Label>
            <Form.Control
              className="w-50 mx-4 form-control"
              type="text"
              value={PanNo}
              placeholder="Pan No"
              {...register("PanNo", {
                pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
              })}
              onChange={(e) => setPanNo(e.target.value)}
            />
          </Form.Group>
          <div style={{ color: "red" }}>
            {errors.PanNo && <p>*Please check the PAN No</p>}
          </div>
          <br />
          </div>
          )
    },
    {
      title: "Educational Details",
      content: (
      <div>
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
      </div>
      )
    },
    {
      title: "Other Details",
      content: ( 
      <div>
      <Form.Group>
      <Form.Label><div className="form-control-label text-muted" 
        style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>RNR NO</div>
      </Form.Label>
        <Form.Control
          className="w-50 mx-4 form-control"
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
      {errors. RNRNO && <p>*Please check the  RNRNO </p>}
     </div>
     <br/>
     <Form.Group>
     <Form.Label><div className="form-control-label text-muted" 
        style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>TNMC NO</div>
      </Form.Label>
        <Form.Control
          className="w-50 mx-4 form-control"
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
      {errors.TNMCNO && <p>*Please check the TNMCNO </p>}
     </div>
     <br/>
     <Form.Group>
     <Form.Label><div className="form-control-label text-muted" 
       style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Validlity Date</div>
      </Form.Label>
        <Form.Control
          className="w-50 mx-4 form-control"
          type="text"
          value={ValidlityDate}
          placeholder="ValidlityDate"
          {...register("ValidlityDate",
          {
            pattern:  /^\d{4}-\d{2}-\d{2}$/
          })}
          onChange={(e) => setValidlityDate(e.target.value)}/>
      </Form.Group>
      <div style={{color:"red"}}>
      {errors.ValidlityDate && <p>*Please check the ValidlityDate </p>}
     </div>
     <br/>
     <div style={{ display: "flex", float:"right"}}>
        <Button style={{backgroundColor:"cadetblue",border:"none"}} onClick={() => { handleSubmit(editemp); }} type="submit" block>
          Save
        </Button>
      </div>
     </div>
     ) 
   }
  ];

 ////retrive image of an employee
 let image = "http://localhost:7000/media/my_Employee/picture/" + name + ".jpg"
  return (
    <div className="App">
      <Form onSubmit={handleSubmit(editemp)}>
      <br/><br/>
      <div className="profile">
        <img src={`${image}`} className="empprofile" alt="profile" />
        <div className="empname">{name + '_' + id}</div>
      </div>
      <VerticalTabs tabs={tabs}></VerticalTabs>
      </Form>
    </div>
  );
}
export default EditForm;











