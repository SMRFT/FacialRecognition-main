import Webcam from "react-webcam";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Label } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import "./Addemp.css";
import Myconstants from "../Components/Myconstants";
function Addemp() {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState("");
  const [imageSrc, setimageSrc] = useState("");
  const [imgSrcname, setimgSrcname] = useState("");
  const [image, setImage] = useState(null);
  const [name, setname] = useState("");
  const [id, setid] = useState("");
  const [mobile, setmobile] = useState("");
  const [shift, setshift] = useState("");
  const [designation, setdesignation] = useState("");
  const [emailid, setemailid] = useState("")
  const [dateofjoining, setdateofjoining] = useState("")
  const [bankaccnum, setbankaccnum] = useState("")
  const [address, setaddress] = useState("");
  const [proof, setproof] = useState("");
  const [certificates, setcertificate] = useState("");
  const [message, setMessage] = useState("");
  const [isShown, setIsShown] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const departments = ["IT", "HR", "LAB", "RT TECH", "PHARMACY", "TELECALLER", "FRONT OFFICE", "SECURITY", "ELECTRICIAN", "ACCOUNTS", "NURSING", "HOUSE KEEPING", "DENSIST CONSULTANT", "COOK"];

  function handleChange(e) {
    setSelectedDepartment(e.target.value);
  }
  const handleClick = (event) => {
    setIsShown((current) => !current);
  };
  const { register, handleSubmit, formState: { errors } } = useForm();
  const handleImageSelect = (event) => {
    setImgSrc(event.target.files[0]);
  };
  const handleRemoveImage = () => {
    setImgSrc(null);
    document.getElementById("selectImage").value = "";
  };

  const handleFileSelect = (e) => {
    setproof(e.target.files);
  };
  const handleRemoveFile = () => {
    setproof(null);
    document.getElementById("selectFile").value = "";
  };

  const handleCertificateSelect = (eve) => {
    setcertificate(eve.target.files);
  };
  const handleRemoveCertificate = () => {
    setcertificate(null);
    document.getElementById("selectCertificate").value = "";
  };

  useEffect(() => {
    if (imgSrc) {
      setImage(URL.createObjectURL(imgSrc));
    }
  }, [imgSrc]);
  const Capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    toDataURL(imageSrc).then((dataUrl) => {
      var fileData = dataURLtoFile(dataUrl, "image.jpg");
      let formData = new FormData();
      formData.append("file", fileData);
      formData.append("file", imageSrc);
      setImgSrc(fileData);
      setimageSrc(imageSrc)
    });
  }, [webcamRef, setImgSrc]);
  const onSubmit = async (details) => {
    const data = new FormData();
    const comprefaceImage = new FormData();
    data.append("name", name);
    data.append("mobile", mobile);
    data.append("department", selectedDepartment);
    data.append("designation", designation);
    data.append("emailid", emailid);
    data.append("dateofjoining", dateofjoining);
    data.append("bankaccnum", bankaccnum);
    data.append("address", address);
    // data.append("proof", proof);
    // data.append("certificates", certificates);
    data.append("shift", shift);
    data.append("id", id);
    data.append("imgSrc", imgSrc);
    data.append("imgSrcname", imgSrc.name);
    comprefaceImage.append("file", imgSrc);
    let formDataNew = new FormData();
    formDataNew.append("file", imgSrc);
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:7000/attendance/addemp",
        data: data,
      });
      const res2 = await axios
        ({
          method: "POST",
          headers: {
            "x-api-key": "3fa600d7-e105-4773-af09-27978223a756",
          },
          url: "http://localhost:8000/api/v1/recognition/faces/?subject=" + name + "_" + id,
          data: comprefaceImage,
        });
      if (res.status === 200 && res2.status === 201) {
        // setMessage(Myconstants.AddEmp);
      } else {
        // setMessage(Myconstants.AddEmpError);
      }
    } catch (err) {
    }
  };
  function refreshPage() {
    {
      window.location.reload();
    }
  }
  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  //converting "Base64" to javascript "File Object"
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename);
  }
  return (
    <div>
      <br />
      <br />
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Name</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your name"
                    {...register("name",
                      {
                        pattern: /^[a-zA-Z_0-9]*$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setname(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.name && <p>*Please enter the valid name</p>}</div>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>ID</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter ID is here"
                    {...register("id",
                      {
                        pattern: /^[a-zA-Z_0-9]*$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setid(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Mobile Number</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your mobile number"
                    {...register("mobile",
                      {
                        pattern: /^[0-9]{10}$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setmobile(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.mobile && <p>*Please enter the valid mobile number</p>}</div>
          <br />
          <div>
            <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Department</div></label>
            <select style={{ borderRadius: 40 }} value={selectedDepartment} onChange={handleChange}>
              <option style={{ textAlign: "center" }} value="" disabled>Select department</option>
              {departments.map((department, index) => (
                <option style={{ textAlign: "center" }} key={index} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <br />
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Designation</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your designation"
                    {...register("designation",
                      {
                        pattern: /^[a-zA-Z ]*$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setdesignation(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.designation && <p>*Please check the designation</p>}</div>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Email Id</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your Email id"
                    {...register("emailid",
                      {
                        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setemailid(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.emailid && <p>*Please check the email</p>}</div>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Date Of Joining</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your Date Of Joining"
                    {...register("dateofjoining",
                      {
                        pattern: /^\d{4}-\d{2}-\d{2}$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setdateofjoining(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.dateofjoining && <p>*Please check the date</p>}</div>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Bank Account Number</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your Bank account number"
                    {...register("bankaccnum",
                      {
                        pattern: /^[0-9]{9,18}$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setbankaccnum(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.bankaccnum && <p>*Please check the Bank account number</p>}</div>
          <Form.Field>
            <Col sm={{ span: 12 }}>
              <div className="mb-3">
                <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Address</div></label>
                <div className="col-sm-7">
                  <input style={{ borderRadius: 40 }}
                    className="w-50 mx-4 form-control"
                    type="text"
                    placeholder="Enter your address"
                    {...register("address",
                      {
                        pattern: /^[0-9/,a-zA-Z- 0-9.]*$/
                      })}
                    required
                    autoComplete="off"
                    onChange={(e) => setaddress(e.target.value)}
                  />
                </div>
              </div>
            </Col>
          </Form.Field>
          <div className="mx-3" style={{ color: "red" }}>
            {errors.address && <p>*Please check the address</p>}</div>
          <div className="mx-5 container" style={{ height: "250px", width: "300px", borderRadius: 40 }}>
            <Webcam style={{ height: "220px", width: "270px", borderRadius: 60 }} audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
          </div>
          <button style={{ marginLeft: "160px", marginTop: "-100px", borderColor: "#B9ADAD" }} className="Click" onClick={Capture}>
            <i className="fa fa-2x fa-camera" aria-hidden="true"></i>
          </button><br /><br />
          <div style={{ marginLeft: "170px" }}><b>(or)</b></div>
          <Col sm={{ span: 12 }}>
            <br />
            <div className="mx-5 form-group">
              <input id="selectImage" type="file" onChange={handleFileSelect} hidden /><b>Choose image:</b>
              <label for="selectImage" className="mx-4 bi bi-cloud-upload" style={{ fontSize: "60px", color: "darkslateblue", opacity: "9.9", WebkitTextStroke: "5.0px", cursor: "pointer" }}></label>
              {imgSrc && (
                <>
                  <span className="mx-3">{imgSrc.name}</span>
                  <button className="btn btn-danger" onClick={handleRemoveImage}>
                    <i className="fa fa-times"></i>
                  </button>
                </>
              )}
            </div>
            <br />
            <div className="mx-5 form-group">
              <input id="selectFile" type="file" onChange={handleFileSelect} hidden /><b>Choose a PAN or Aadhaar proof :</b>
              <label for="selectFile" className="mx-4 fa fa-cloud-upload" style={{ fontSize: "60px", color: "darkslateblue", opacity: "9.9", WebkitTextStroke: "5.0px", cursor: "pointer" }}></label>
              {proof && (
                <>
                  <span className="mx-3">{proof.name}</span>
                  <button className="btn btn-danger" onClick={handleRemoveFile}>
                    <i className="fa fa-times"></i>
                  </button>
                </>
              )}
            </div>
            <br />
            <div className="mx-5 form-group">
              <input id="formFileMultiple" type="file" onChange={handleCertificateSelect} multiple hidden /><b>Choose a Certificates (multiple file select) :</b>
              <label for="formFileMultiple" className="mx-4 fa fa-cloud-upload" style={{ fontSize: "60px", color: "darkslateblue", opacity: "9.9", WebkitTextStroke: "5.0px", cursor: "pointer" }}></label>
              {certificates && (
                <>
                  <span className="mx-3">{certificates.name}</span>
                  <button className="btn btn-danger" onClick={handleRemoveCertificate}>
                    <i className="fa fa-times"></i>
                  </button>
                </>
              )}
            </div>
            <br />
            <br />
            <button class="button-71" role="button" type="submit" onClick={() => { handleClick() }}>ADD EMPLOYEE</button>
          </Col>
          <br />
        </Form>
      </Row>
      <br />
      <div for="slide"
        style={{ display: isShown ? "none" : "block" }}
      >
        {image && imgSrc && (
          <img
            className="rounded-circle"
            for="slide"
            style={{ height: "200px", width: "200px", marginLeft: "800px", marginTop: "-2600px" }}
            src={image}
            alt={imgSrc.name} />
        )}
        <div style={{ marginLeft: "800px", marginTop: "-1150px", font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "25px" }}>
          <div><b>Name : </b>{name}</div>
          <div><b>Mobile : </b>{mobile}</div>
          <div><b>Designation : </b>{designation}</div>
          <div><b>Address : </b>{address}</div><br /><br /><br />
          <i class="bi bi-check-circle" onClick={() => { refreshPage(); }} style={{ fontSize: "40px", color: "green", marginLeft: "100px" }}> </i>
        </div>
        <br />
        <div style={{ marginLeft: "800px", font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }} className="message">{message ? <p>{message}</p> : null}</div>
      </div>
    </div>
  );
}
export default Addemp;
