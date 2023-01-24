import { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
//import { json } from "express";
const EditForm = ({ theuser }) => {
  const id = theuser.id;
  const [name, setname] = useState(theuser.name);
  const [mobile, setmobile] = useState(theuser.mobile);
  const [address, setaddress] = useState(theuser.address);
  const [designation, setdesignation] = useState(theuser.designation);

  const { register,handleSubmit,formState: { errors } } = useForm();

    const editemp = () => {
      let res = fetch("http://localhost:7000/attendance/editemp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: name,
          mobile: mobile,
          address: address,
          designation: designation
        }),
      });
  }
  function refreshPage() {
   {
      window.location.reload();
    }
}

  return (
    <div className="App">
      <Form onSubmit={handleSubmit(editemp)}>
        <Form.Group>
          <Form.Control
            type="text" 
            value={name} 
            placeholder="name"  
            onChange={(e) => setname(e.target.value)} 
            disabled/>
            <br/>
            <div style={{color:"red"}}>*This field not be editable</div>
        </Form.Group>
        <br/>
        <Form.Group>
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
        <Form.Group>
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
        <Form.Group>
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
        <br/>

        <div style={{float:"left"}}>
        <Button onClick={() => {handleSubmit(editemp);}}  variant="success" type="submit" block>
          Save
        </Button>
        </div>

        <div style={{float:"right"}}>
        <Button onClick={() => {refreshPage();}}  variant="danger" type="submit" block>
          Close
        </Button>
        </div>
      </Form>
    </div>
  );
}
export default EditForm;