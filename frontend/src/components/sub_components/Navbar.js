import {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';

import { useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';

export default function Navbar() {
    const navigate = useNavigate();
    const [myname, setMyName] = useState("Welcome");
    
    useEffect(() => {
        if (localStorage.getItem("loggedIn") === "true") {
            fetch('http://127.0.0.1:8000/my-details', {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }
            }).then((response) => response.json()).then((data) => {
                if (data['status'] === "OK") {
                    setMyName(data.data['first_name']);
                    localStorage.setItem("user_email", data.data['email']);
                } else {
                    alert("[*] Something went wrong, please log-in again !!!");
                    localStorage.clear();
                    navigate("/");
                }
            }).catch((error) => {
                alert("[*] Something went wrong, please try again !!!");
                localStorage.clear();
                navigate("/");
            });
        } else {
            localStorage.clear();
            navigate("/");
        }
        // eslint-disable-next-line
    }, []);

    const logout = (e) => {
        localStorage.clear();
        navigate("/");
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Sidebar/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Welcome, {myname} !
                    </Typography>
                    <div style={{ cursor: "pointer" }} onClick={logout}>
                        Logout
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <LogoutIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}