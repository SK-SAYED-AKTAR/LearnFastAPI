import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [imgSrc, setImgSrc] = useState("https://picsum.photos/200/300");
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("loggedIn")==="true"){
      fetch('http://127.0.0.1:8000/dashboard', {
        method: 'GET',
        headers: {Authorization: `Bearer ${localStorage.getItem('user_token')}`}
      }).then((response) => response.json()).then((data) => {
        if (data['status'] === "OK") {
          setFirstName(data.data['first_name']);
          setLastName(data.data['last_name']);
          setEmail(data.data['email']);
          setPassword(data.data['password']);
          setGender(data.data['gender']);
          setImgSrc(`http://127.0.0.1:8000/getImg/${data.data['photo']}`);
        } else {
          alert("[*] Something went wrong, please try again !!!");
          localStorage.clear();
          navigate("/");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        localStorage.clear();
      });
    }else{
      localStorage.clear();
      navigate("/");
    }
    // eslint-disable-next-line
  },[])

  const formSubmit = async (e) => {
    const formData = new FormData();
    formData.append("first_name", document.getElementById("fname").value);
    formData.append("last_name", document.getElementById("lname").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("password", document.getElementById("pwd").value);
    formData.append("gender", gender);
    if(document.getElementById("photo").files[0]!==undefined){
      formData.append("photo", document.getElementById("photo").files[0]);
    }

    fetch('http://127.0.0.1:8000/update_user', {
      method: 'POST',
      body: formData,
      headers: {Authorization: `Bearer ${localStorage.getItem('user_token')}`}
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data['status'] === "OK") {
        alert("New Data Updated Successfully !!!");
        localStorage.setItem("user_token", data['updated_token']);
      } else {
        alert("Something went wrong, please try again !!!")
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  function previewImage(e) {
    setImgSrc(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <div className="App">
        <header className="App-header">
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
                  <Grid item xs={6} style={{textAlign: "center"}}>
                    <label htmlFor="photo" style={{cursor: "pointer"}}>
                      <img src={imgSrc} style={{height: "100px", width: "100px", borderRadius: "50%" }} alt="alt-img"/>
                      <input id="photo" onChange={previewImage} type="file" style={{display: "none"}}/>
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="fname"
                      label="First name"
                      type="text"
                      value={first_name}
                      onChange={(e)=>{setFirstName(e.target.value)}}
                      style={{ backgroundColor: "white" }}
                    />
                    <TextField
                      id="lname"
                      label="Last name"
                      value={last_name}
                      onChange={(e)=>{setLastName(e.target.value)}}
                      type="text"
                      style={{ backgroundColor: "white" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="email"
                      label="Email address"
                      value={email}
                      onChange={(e)=>{setEmail(e.target.value)}}
                      type="email"
                      style={{ backgroundColor: "white" }}
                    />
                    <TextField
                      id="pwd"
                      value={password}
                      onChange={(e)=>{setPassword(e.target.value)}}
                      label="Password"
                      type="password"
                      style={{ backgroundColor: "white" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <select
                      id="gender"
                      style={{ width: "98%", paddingTop: "15px", paddingBottom: "15px", backgroundColor: "white" }}
                      value={gender}
                      onChange={(e)=>{setGender(e.target.value)}}
                    >
                      <option value="" defaultChecked>-- SELECT GENDER --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Grid>
                  <Grid item xs={6} style={{ textAlign: "center", marginTop: "5%" }}>
                    <Button onClick={formSubmit} variant="contained" style={{ marginRight: "10px" }}>Update Profile</Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </div>
        </header>
      </div>
    </div>
  )
}
export default UpdateUser

