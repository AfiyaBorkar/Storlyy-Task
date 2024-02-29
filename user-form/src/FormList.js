import React, { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";



const FormList = () => {
  const [forms, setForms] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  const userDetails = JSON.parse(localStorage.getItem("userFormDetails"));
  // Fetch forms data from the backend when component mounts
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND}/forms/${userDetails}`
        ); // Assuming the endpoint is correct
        setForms(response.data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const formatDOB = (dob) => {
    const date = new Date(dob);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const backtoHome = ()=>{
    localStorage.removeItem("userFormDetails");
    window.location.href ="/"
  }
  return (
    <>
      <CssBaseline />
      {/* <Container maxWidth="sm"> */}
      <Box
        sx={{ bgcolor: "#cfe8fc", height: "20vh" }}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div>
          <h2>Forms Filled by {userDetails}</h2>
          <Button variant="contained" onClick={backtoHome}>Back to home</Button>
        </div>
      </Box>
      <Paper
        style={{
          width: "90vw",
          margin: "5vw",
          boxShadow:
            "rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Phone Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((form) => (
                  <TableRow key={form._id}>
                    <TableCell>{form.name}</TableCell>
                    <TableCell>{form.email}</TableCell>
                    <TableCell>{formatDOB(form.dob)}</TableCell>
                    <TableCell>{form.phone}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={forms.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* </Box> */}

      {/* </Container> */}
    </>
  );
};

export default FormList;
