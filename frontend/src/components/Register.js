import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Link, useNavigate } from "react-router-dom";


function Register() {

  const navigate = useNavigate();

  const formSubmit = async (e) => {
    navigate("/dashboard");

    const formData = new FormData();
    formData.append("first_name", document.getElementById("fname").value);
    formData.append("last_name", document.getElementById("lname").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("pwd").value);
    formData.append("gender", document.getElementById("gender").value);
    formData.append("photo", document.getElementById("photo").files[0]);

    fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      if (data['status'] === "OK") {
        localStorage.setItem("user_token", data['token']);
        localStorage.setItem("loggedIn", "true");
        navigate("/dashboard");
      } else {
        alert("Something went wrong, please try again !!!")
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };


  const simpleGetReq = (e) => {
    fetch('http://127.0.0.1:8000', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => {
      if (data['status'] === "OK") {
        alert(data['msg']);
      } else {
        alert("Something went wrong, please try again !!!")
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }


  return (
    <div className="App">
      <header className="App-header" style={{marginTop: "10%"}}>
        <div>
          <Box
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <form>
              <Grid>
                <Grid item xs={6}>
                  <TextField
                    id="fname"
                    label="First name"
                    type="text"
                    style={{ backgroundColor: "white" }}
                  />
                  <TextField
                    id="lname"
                    label="Last name"
                    type="text"
                    style={{ backgroundColor: "white" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="email"
                    label="Email address"
                    type="email"
                    style={{ backgroundColor: "white" }}
                  />
                  <TextField
                    id="pwd"
                    label="Password"
                    type="password"
                    style={{ backgroundColor: "white" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <select
                    id="gender"
                    style={{ width: "98%", paddingTop: "15px", paddingBottom: "15px", backgroundColor: "white" }}
                  >
                    <option value="" defaultChecked>-- SELECT GENDER --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Grid>
                <Grid item xs={6} style={{ marginLeft: "2%", marginTop: "3%", textAlign: "left" }}>
                    <span style={{marginRight: "10px"}}>Profile Photo:</span><input type="file" id="photo" />
                </Grid>
                <Grid item xs={6} style={{ textAlign: "center", marginTop: "5%" }}>
                    <Button onClick={formSubmit} variant="contained" style={{ marginRight: "10px" }}>Register</Button>
                </Grid>
                <div style={{ textAlign: "center", marginTop: "2%" }}>
                    <Link to="/login">
                        <span style={{fontSize: "15px"}}>Already Have an account? <u style={{color: "blue"}}>Login Here</u></span>
                    </Link>
                </div>
              </Grid>
            </form>
          </Box>
          <br></br>
          <br></br>
            <Button onClick={simpleGetReq} variant="contained" style={{ marginRight: "10px", display: "none" }}>Simple Get Request</Button>
        </div>
      </header>
    </div>
  );
}

export default Register;