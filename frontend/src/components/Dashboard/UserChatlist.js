import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TelegramIcon from '@mui/icons-material/Telegram';
import Divider from '@mui/material/Divider';



const UserChatlist = () => {
    const navigate = useNavigate();
    const [allFriend, setAllFriend] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("loggedIn") === "true") {
            fetch('http://127.0.0.1:8000/my-friend-list', {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` }
            }).then((response) => response.json()).then((data) => {
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

    const gotoChatRoom = (item) => {
        // Get/Create chatroomid
        makeChatroomId(item);
    };

    const makeChatroomId = async (item) => {
        const formData = new FormData();
        formData.append("friend_email", item.email);
        await fetch('http://127.0.0.1:8000/makeChatroomId', {
            method: 'POST',
            headers: {Authorization: `Bearer ${localStorage.getItem('user_token')}`},
            body: formData
        }).then((response) => response.json()).then((data) => {
            if (data['status'] === "OK") {
                navigate("/dashboard/chatroom", {state: {"item": item}});
            } else {
                console.warn(data);
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
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
                            <Card sx={{ width: 400, overflow: "scroll", height: 480 }}>
                                <MenuList>
                                    {allFriend.length > 0 && allFriend.map((item) => {
                                        return (
                                            <MenuItem key={item.email}>
                                                {Array.from(item.friend_list).includes(localStorage.getItem("user_email")) &&
                                                    <div onClick={()=>gotoChatRoom(item)}>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <ListItemIcon style={{ marginRight: "5%", display: "inline" }}>
                                                                            <img src={`http://127.0.0.1:8000/getImg/${item.photo}`} style={{ display: "inline", height: "50px", width: "50px", borderRadius: "50%" }} alt="alt-img" />
                                                                        </ListItemIcon>
                                                                    </td>
                                                                    <td style={{ textAlign: "left", width: "260px" }}>
                                                                        <div style={{ display: "inline", width: "200px" }}>
                                                                            <Typography variant="inherit" style={{ display: "inline" }}>
                                                                                {item.first_name} {item.last_name}
                                                                            </Typography>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <TelegramIcon />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <Divider />
                                                    </div>
                                                }
                                            </MenuItem>
                                        )
                                    })}
                                </MenuList>
                            </Card>
                        </Box>
                    </div>
                </header>
            </div>
        </div>
    )
}

export default UserChatlist