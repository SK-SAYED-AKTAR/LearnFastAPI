import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

const MyFriend = () => {
    const navigate = useNavigate();
    const [allFriend, setAllFriend] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("loggedIn") === "true") {
            fetch('http://127.0.0.1:8000/my-friend-list', {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }
            }).then((response) => response.json()).then((data) => {
                console.log(data.data);
                if (data['status'] === "OK") {
                    setAllFriend(data.data);
                } else {
                    console.warn(data);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        } else {
            navigate("/");
        }
        // eslint-disable-next-line
    }, []);

    const unFriend = (email) => {
        const formData = new FormData();
        formData.append('email', email);
        fetch('http://127.0.0.1:8000/un-friend', {
            method: 'POST',
            body: formData,
            headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }
        }).then((response) => response.json()).then((data) => {
            if (data['status'] === "OK") {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

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
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                    <TableHead style={{ backgroundColor: "black" }}>
                                        <TableRow>
                                            <TableCell align="center" style={{ fontWeight: "bolder", color: "whitesmoke" }}>Photo</TableCell>
                                            <TableCell align="center" style={{ fontWeight: "bolder", color: "whitesmoke" }}>Name</TableCell>
                                            <TableCell align="center" style={{ fontWeight: "bolder", color: "whitesmoke" }}>Gender</TableCell>
                                            <TableCell align="center" style={{ fontWeight: "bolder", color: "whitesmoke" }}>Meet</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {allFriend.length > 0 && allFriend.map((item)=>{
                                            return (
                                                <TableRow key={item.email}>
                                                    {Array.from(item.friend_list).includes(localStorage.getItem("user_email")) && 
                                                        <>
                                                            <TableCell align="center">
                                                                <img src={`http://127.0.0.1:8000/getImg/${item.photo}`} style={{height: "50px", width: "50px", borderRadius: "50%" }} alt="alt-img"/>
                                                                {item.friend_list.length}+
                                                            </TableCell>
                                                            <TableCell align="center">{item.first_name} {item.last_name}</TableCell>
                                                            <TableCell align="center">{item.gender}</TableCell>
                                                            <TableCell align="center">
                                                                <Button onClick={()=>unFriend(item.email)} variant='outlined'>Un-Friend</Button>
                                                            </TableCell>
                                                        </>
                                                        
                                                    }
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </div>
                </header>
            </div>
        </div>
    )
}

export default MyFriend