import Webcam from "react-webcam";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Label } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import "./Addemp.css";
import Myconstants from "../Components/Myconstants";
import "../Logo.css";
function Addemp() {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [imgSrcname, setImgSrcname] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [mobile, setMobile] = useState("");
  const [shift, setshift] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("")
  const [dateofjoining, setDateOfJoining] = useState("");
  const [bankaccnum, setBankAccNum] = useState("");
  const [address, setAddress] = useState("");
  const [proof, setProof] = useState(null);
  const [proof_url, setProofUrl] = useState("");
  const [certificates_url, setCertificateUrl] = useState("");
  const [certificates, setCertificate] = useState(null);
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


  const handleRemoveFile = () => {
    setProof(null);
    document.getElementById("selectFile").value = "";
  };

  const handleCertificateSelect = (e) => {
    setCertificate(e.target.files[0]);

  };

  const handleRemoveCertificate = () => {
    setCertificate(null);
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
      setImageSrc(imageSrc)
    });
  }, [webcamRef, setImgSrc]);
  const onSubmit = async (details) => {
    const data = new FormData();
    const comprefaceImage = new FormData();
    data.append("name", name);
    data.append("mobile", mobile);
    data.append("department", selectedDepartment);
    data.append("designation", designation);
    data.append("email", email);
    data.append("dateofjoining", dateofjoining);
    data.append("bankaccnum", bankaccnum);
    data.append("address", address);
    data.append("proof", proof);
    data.append("certificates", certificates);
    data.append("shift", shift);
    data.append("id", id);
    data.append("imgSrc", imgSrc);
    data.append("imgSrcname", imgSrc.name);
    comprefaceImage.append("file", imgSrc);
    let formDataNew = new FormData();
    formDataNew.append("file", imgSrc);
    let formData = new FormData();
    formData.append("file", proof);
    formData.append("file", certificates);
    try {
      const res = await axios({
        method: "post",
        url: "http://localhost:7000/attendance/addemp",
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: data,
      });
      const { proof_url, certificates_url } = res.data;
      console.log(res.data)
      setProofUrl(proof_url);
      console.log("proof_url: ", proof_url)
      setCertificateUrl(certificates_url);
      console.log("certificates_url: ", certificates_url)
      const res2 = await axios
        ({
          method: "POST",
          headers: {
            "x-api-key": "6b447d65-7b43-4e94-ada9-cf54e57bdf16",
          },
          url: "http://localhost:8000/api/v1/recognition/faces/?subject=" + name + "_" + id,
          data: comprefaceImage,
        });
      if (res.status === 200 && res2.status === 201) {
        setMessage(Myconstants.AddEmp);
      } else {
        setMessage(Myconstants.AddEmpError);
      }
    }
    catch (err) {
    }
  };

  // Refresh function
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

  // Validation for forms
  function validateName(name) {
    let error = "";
    if (!name.match(/^[a-zA-Z]*$/)) {
      error = "*Name should only contain letters";
    }
    return error;
  }
  function validateId(id) {
    let error = "";
    if (!id.match(/^[0-9]*$/)) {
      error = "*Id should contain numbers only";
    }
    return error;
  }
  function validateMobile(mobile) {
    let error = "";
    if (mobile !== "" && !/^[0-9]{11}$/.test(mobile)) {
      error = "*Mobile Number should only contain 10 digits";
    }
    return error;
  }

  function validateDesignation(designation) {
    let error = "";
    if (!designation.match(/^[a-zA-Z]*$/)) {
      error = "*Designation should only contain letters";
    }
    return error;
  }
  function validateEmail(email) {
    let error = "";
    if (email !== "" && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
      error = "*Invalid email address";
    }
    return error;
  }
  function validateDateOfJoining(dateofjoining) {
    let error = "";
    if (dateofjoining !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dateofjoining)) {
      error = "*Invalid date format. Please use YYYY-MM-DD";
    } else if (dateofjoining !== "") {
      const parts = dateofjoining.split('-');
      const month = parseInt(parts[1], 10);
      if (month < 1 || month > 12) {

        error = "*Invalid month. Please use a value between 1 and 12";
      }
    }
    return error;
  }
  function validateBankAccNum(bankaccnum) {
    let error = "";
    if (bankaccnum !== "" && !/^[0-9]{9,18}$/.test(bankaccnum)) {
      error = "*Invalid bank account number. It should contain 9 to 18 digits";
    }
    return error;
  }
  function validateAddress(address) {
    let error = "";
    if (!address.match(/^[0-9/,a-zA-Z- 0-9.]*$/)) {
      error = "*Address should only contain numbers, letters, commas, dots, slashes, and spaces";
    }
    return error;
  }
  return (
    <body>
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
                      ref={register("name", { pattern: /^[a-zA-Z]*$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setName(e.target.value); validateName(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateName(name) ? <p>{validateName(name)}</p> : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>ID</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter ID is here"
                      ref={register("id", { pattern: /^[0-9]*$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setId(e.target.value); validateId(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateId(id) ? <p>{validateId(id)}</p> : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Mobile Number</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter your mobile number"
                      ref={register("mobile", { pattern: /^[0-9]{10}$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setMobile(e.target.value); validateMobile(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateMobile(mobile) ? <p>{validateMobile(mobile)}</p> : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 6 }}>
                <div className="mb-3">
                  <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Department</div></label>
                  <div className="col-sm-7">
                    <select className="w-50 mx-4" form-control style={{ borderRadius: 40 }} value={selectedDepartment} onChange={handleChange}>
                      <option style={{ textAlign: "center" }} value="" disabled>Select department</option>
                      {departments.map((department, index) => (
                        <option style={{ textAlign: "center" }} key={index} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Designation</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter your designation"
                      ref={register("designation", { pattern: /^[a-zA-Z]*$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setDesignation(e.target.value); validateDesignation(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateDesignation(designation) ? <p>{validateDesignation(designation)}</p> : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Email Id</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter your Email id"
                      ref={register("email", { pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                      required
                      autoComplete="off"
                      onChange={e => { setEmail(e.target.value); validateEmail(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateEmail(email) ? validateEmail(email) : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Date Of Joining</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter your Date Of Joining"
                      ref={register("dateofjoining", { pattern: /^\d{4}-\d{2}-\d{2}$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setDateOfJoining(e.target.value); validateDateOfJoining(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateDateOfJoining(dateofjoining) ? validateDateOfJoining(dateofjoining) : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className="mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Bank Account Number</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter your Bank account number"
                      ref={register("bankaccnum", { pattern: /^[0-9]{9,18}$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setBankAccNum(e.target.value); validateBankAccNum(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateBankAccNum(bankaccnum) ? <p>{validateBankAccNum(bankaccnum)}</p> : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <Form.Field>
              <Col sm={{ span: 12 }}>
                <div className="mb-3">
                  <label className=" mx-3 form-label"><div className="form-control-label text-muted" style={{ font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }}>Address</div></label>
                  <div className="col-sm-7">
                    <input style={{ borderRadius: 40 }}
                      className="w-50 mx-4 form-control"
                      type="text"
                      placeholder="Enter your address"
                      ref={register("address", { pattern: /^[0-9/,a-zA-Z- 0-9.]*$/ })}
                      required
                      autoComplete="off"
                      onChange={e => { setAddress(e.target.value); validateAddress(e.target.value); }}
                    />
                    <div style={{ color: "red", marginLeft: "55%", marginTop: "-4%" }}>{validateAddress(address) ? <p>{validateAddress(address)}</p> : null}</div>
                  </div>
                </div>
              </Col>
            </Form.Field>
            <br />
            <div className="mx-5 container" style={{ height: "250px", width: "300px", borderRadius: 40 }}>
              <Webcam style={{ height: "220px", width: "270px", borderRadius: 60 }} audio={false} ref={webcamRef} screenshotFormat="image/jpg" />
            </div>
            <button style={{ marginLeft: "160px", marginTop: "-100px", borderColor: "#B9ADAD" }} className="Click" onClick={Capture}>
              <i className="fa fa-2x fa-camera" aria-hidden="true"></i>
            </button><br /><br />
            <div style={{ marginLeft: "170px" }}><b>(or)</b></div>
            <Col sm={{ span: 12 }}>
              <br />
              <div className="mx-5 form-group">
                <input id="selectImage" type="file" onChange={handleImageSelect} hidden /><b>Choose image:</b>
                <label for="selectImage" className="mx-4 bi bi-cloud-arrow-up" style={{ fontSize: "50px", color: "#00A693", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
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

              <br />
              <div className="mx-5 form-group">
                <input id="formFileMultiple" type="file" accept=".pdf" onChange={handleCertificateSelect} multiple hidden /><b>Choose a Certificates (multiple file select) :</b>
                <label for="formFileMultiple" className="mx-4 bi bi-folder-plus" style={{ fontSize: "40px", color: "#00A693", opacity: "9.9", WebkitTextStroke: "2.0px", cursor: "pointer" }}></label>
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
              <button className="button-71" role="button" type="submit" onClick={() => { handleClick() }}>ADD EMPLOYEE</button>
            </Col>
            <br />
          </Form>
        </Row>
        <br />
        <div id="slide"
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
            <div><b>Address : </b>{address}</div><br />
            {proof_url && (
              <div>
                <h4>Proof</h4>
                <iframe src={proof_url} width="50%" height="400px" />
              </div>
            )}
            {certificates_url && (
              <div>
                <h4>Certificates</h4>
                <iframe src={certificates_url} width="50%" height="400px" />
              </div>
            )}
            <br />
            <i className="bi bi-check-circle" onClick={() => { refreshPage(); }} style={{ fontSize: "40px", color: "green", marginLeft: "100px", cursor: "pointer" }}> </i>
          </div>
          <br />
          <div style={{ marginLeft: "800px", font: "caption", fontStyle: "italic", fontFamily: "-moz-initial", fontSize: "20px" }} className="message">{message ? <p>{message}</p> : null}</div>
        </div>
      </div>
    </body>
  );
}
export default Addemp;
