import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { Link, useNavigate } from "react-router-dom";


function Register() {
    const navigate = useNavigate();

    const formSubmit = async (e) => {
        const formData = new FormData();
        formData.append("email", document.getElementById("email").value);
        formData.append("password", document.getElementById("pwd").value);

        fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            body: formData,
        }).then((response) => response.json())
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
                                        id="email"
                                        label="Email address"
                                        type="email"
                                        style={{ backgroundColor: "white" }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="pwd"
                                        label="Password"
                                        type="password"
                                        style={{ backgroundColor: "white" }}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{ textAlign: "center", marginTop: "5%" }}>
                                    <Button onClick={formSubmit} variant="contained" style={{ marginRight: "10px" }}>Login</Button>
                                </Grid>
                                <div style={{ textAlign: "center", marginTop: "5%" }}>
                                    <Link to="/">
                                        <span style={{fontSize: "15px"}}>Don't Have an account? <u style={{color: "blue"}}>Register Here</u></span>
                                    </Link>
                                </div>
                            </Grid>
                        </form>
                    </Box>
                </div>
            </header>
        </div>
    );
}

export default Register;