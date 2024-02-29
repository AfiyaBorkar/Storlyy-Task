import React, { useState } from "react";
import axios from "axios";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import Toaster from "./Toaster";


const UserForm = () => {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [FormStatus, setFormStatus] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    if (!name || !dob || !email || !phone) {
      // alert("Please fill in all fields");
      setFormStatus({ msg: "Please fill in all fields", key: Math.random() });

      return;
    }

    // Check if phone number is exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
      setFormStatus({ msg: "Please enter a valid 10-digit phone number", key: Math.random() });
      // alert("");
      
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND}/user-form`, {
        name,
        dob,
        email,
        phone,
      });

      const userDetails = localStorage.setItem(
        "userFormDetails",
        JSON.stringify(response.data.data.email)
      );
      setFormStatus({ msg: "Form submitted successfully", key: Math.random() });

      nav(`/forms/${response.data.data._id}`);
      // Check the response status code

    } catch (error) {
      console.error("Error submitting form:", error);
      // if(error.response.status)
      const mssg = "Failed to submit form : " + error.response.data.error;

      // alert("Failed to submit form : " + error.response.data.error);
      setFormStatus({ msg: mssg, key: Math.random() });

    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        {/* <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} /> */}
        <Box
          sx={{ height: "100vh" }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <FormControl fullWidth>
            <div
              className="formcontainers"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                justifyContent: "center",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                height: "80vh",
              }}
            >
              <h2>User Form</h2>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div>
                  {/* <label>Name:</label> */}
                  {/* <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  /> */}
                  <TextField
                    required
                    id="outlined-required"
                    label="Name"
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* <label>Date of Birth:</label> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Date of Birth"
                        value={dob}
                        onChange={(date) => setDob(date)}
                        views={["year", "month", "day"]}
                        //dateFormat="yyyy-MM-dd"
                        //  maxDate={new Date()}
                        required
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  {/* <DatePicker
                    selected={dob}
                    onChange={(date) => setDob(date)}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    required
                  /> */}
                </div>
                <div>
                  {/* <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  /> */}
                  <TextField
                    type="email"
                    required
                    id="outlined-required"
                    label="Email"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  {/* <label>Phone:</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  /> */}
                  <TextField
                    type="tel"
                    required
                    id="outlined-required"
                    label="Phone Number"
                    defaultValue={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button variant="contained" type="submit">
                  Submit
                </Button>
                {/* <button type="submit">Submit</button> */}
              </form>
            </div>
          </FormControl>
        </Box>
        {FormStatus ? (
            <Toaster key={FormStatus.key} message={FormStatus.msg} />
          ) : null}
      </Container>
    </>
  );
};

export default UserForm;
