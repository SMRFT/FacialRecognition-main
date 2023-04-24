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
  const [ValidlityDate, setValidlityDate] = useState(theuser.ValidlityDate);
  const [educationData, setEducationData] = useState(theuser.educationData);
  const [department, setdepartment] = useState(theuser.department);
  const [dateofjoining, setdateofjoining] = useState(theuser.dateofjoining);
  const [showTable, setShowTable] = useState(false);
  const [dataArray, setDataArray] = useState(JSON.parse(educationData));
  const [showMessage, setShowMessage] = useState(false);
  const { register,handleSubmit,formState: { errors } } = useForm();
  const [proof, setProof] = useState(theuser.proof);
  const [certificates, setCertificate] = useState(theuser.certificates);

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
  
  const handleFileSelect = (e) => {
    setProof(e.target.files[0]);
  };

  const handleCertificateSelect = (e) => {
    setCertificate(e.target.files[0]);
  };
  
  useEffect(() => {
    handleViewTable();
  }, []);

  const handleViewTable = () => {
    if (dataArray && dataArray.length > 0) {
      setShowTable(true);
      setShowMessage(false);
    } else {
      setShowTable(false);
      setShowMessage(true);
    }
  };

  const editemp = async () => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("address", address);
      formData.append("designation", designation);
      formData.append("department", department);
      formData.append("dateofjoining",dateofjoining)
      formData.append("email", email);
      formData.append("Aadhaarno", Aadhaarno);
      formData.append("PanNo", PanNo);
      formData.append("RNRNO", RNRNO);
      formData.append("TNMCNO", TNMCNO);
      formData.append("ValidlityDate", ValidlityDate);
      formData.append("educationData", JSON.stringify(dataArray));
      formData.append("proof", proof);
      formData.append("certificates", certificates);
      const res = await fetch(`http://localhost:7000/attendance/editemp`, {
        method: "PUT",
        body: formData,
      });
      handleUpdateResponse(res);
    } catch (error) {
      console.error(error);
    }
  };
  

  const tabs = [
    {
      title: <div className="tab-title" id="personal-details">Personal Details</div> ,
      content: (
        <div class="tab-content active" id='tab1'>
          <Form.Group>
            <Form.Label><div className="form-control-label text-muted" 
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Mobile</div>
            </Form.Label>
            <Form.Control style={{borderRadius:"0.5cm"}}
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
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Email</div>
            </Form.Label>
            <Form.Control style={{borderRadius:"0.5cm"}}
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
          style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Department</div>
        </Form.Label>
          <Form.Control style={{borderRadius:"0.5cm"}}
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
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Designation</div>
          </Form.Label>
            <Form.Control style={{borderRadius:"0.5cm"}}
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
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Address</div>
            </Form.Label>
            <Form.Control style={{borderRadius:"0.5cm"}}
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
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Aadhaar No</div>
            </Form.Label>
            <Form.Control style={{borderRadius:"0.5cm"}}
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
              style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Pan No</div>
            </Form.Label>
            <Form.Control style={{borderRadius:"0.5cm"}}
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
      title: <div className="tab-title" id="educational-details">Educational Details</div> ,
      content: (
      <div class="tab-content" id='tab2'>
      {showMessage && (
      <p><b><center>You haven't added any education details yet!</center></b></p>
    )}
    {showTable && (
      <Form.Group>
      <Table striped hover className='emptable'>
      <thead>
        <tr>
          <th style={{textAlign:"center",color:"lightcyan"}}>SNo</th>
          <th style={{textAlign:"center",color:"lightcyan"}}>Degree</th>
          <th style={{textAlign:"center",color:"lightcyan"}}>Major</th>
          <th style={{textAlign:"center",color:"lightcyan"}}>Institution</th>
          <th style={{textAlign:"center",color:"lightcyan"}}>Marks</th>
          <th style={{textAlign:"center",color:"lightcyan"}}>Division</th>
          <th style={{textAlign:"center",color:"lightcyan"}}>Year</th>
        </tr>
      </thead>
      <tbody>
        {dataArray.map((data, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.degree}
                onChange={(e) => handleInputChange(e, index, "degree")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.major}
                onChange={(e) => handleInputChange(e, index, "major")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.institution}
                onChange={(e) => handleInputChange(e, index, "institution")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.marks}
                onChange={(e) => handleInputChange(e, index, "marks")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.division}
                onChange={(e) => handleInputChange(e, index, "division")}
              />
            </td>
            <td>
              <Form.Control style={{borderRadius:"0.2cm"}}
                type="text"
                value={data.year}
                onChange={(e) => handleInputChange(e, index, "year")}
              />
            </td>
          </tr>
        ))}
      </tbody>
      </Table>
      </Form.Group>
      )}
      </div>
      )
    },
    {
      title: <div className="tab-title" id="other-details">Other Details</div> ,
      content: ( 
      <div class="tab-content" id='tab3'>
      <Form.Group>
      <Form.Label><div className="form-control-label text-muted" 
        style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>RNR NO</div>
      </Form.Label>
        <Form.Control style={{borderRadius:"0.5cm"}}
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
        style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>TNMC NO</div>
      </Form.Label>
        <Form.Control style={{borderRadius:"0.5cm"}}
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
       style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px" }}>Validlity Date</div>
      </Form.Label>
        <Form.Control style={{borderRadius:"0.5cm"}}
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
     <div className="form-group">
      <input id="selectFile" type="file" accept=".pdf" onChange={handleFileSelect} hidden />
      <div className="form-control-label text-muted" 
       style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>PAN or Aadhaar proof</div>
      <label for="selectFile" className="mx-4 bi bi-folder-check" style={{ fontSize: "40px", color:"cadetblue", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
     </div>
      <br />
     <div className="form-group">
      <input id="formFileMultiple" type="file" accept=".pdf" onChange={handleCertificateSelect} multiple hidden />
      <div className="form-control-label text-muted" 
       style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "18px"  }}>Certificates</div>
      <label for="formFileMultiple" className="mx-4 bi bi-folder-plus" style={{ fontSize: "40px", color:"cadetblue", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
    </div>  
     <div style={{ display: "flex", float:"right"}}>
        <Button style={{backgroundColor:"cadetblue",border:"none"}} onClick={() => { handleSubmit(editemp); }} type="submit" block>
          Save
        </Button>
      </div>
     </div>
     ) 
   }
  ];

  return (
    <div className="App">
      <Form onSubmit={handleSubmit(editemp)}>
      <VerticalTabs tabs={tabs}></VerticalTabs>
      </Form>
    </div>
  );
}
export default EditForm;