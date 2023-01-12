import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TelegramIcon from '@mui/icons-material/Telegram';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';



const ChatRoom = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const navigateLocation = useLocation();

    const mywebsocket = new WebSocket(`ws://localhost:8000/saveChat?my_email=${localStorage.getItem("user_email")}&friend_email=${navigateLocation.state.item.email}`);


    useEffect(() => {
        getChatUpdateData();
        // eslint-disable-next-line
    }, [0]);

    const getChatUpdateData = () => {
        if (localStorage.getItem("loggedIn") === "true") {
            const formData = new FormData();
            formData.append("friend_email", navigateLocation.state.item.email);
            fetch('http://127.0.0.1:8000/getChat', {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` },
                body: formData
            }).then((response) => response.json()).then((data) => {
                if (data['status'] === "OK") {
                    setMessages(data.data);
                } else {
                    console.warn(data);
                }
            }).catch((error) => {
                console.error('Error:', error);
            });
        } else {
            navigate("/");
        }
    };

    const sendMsg = async () => {
        var data = document.getElementById("msg").value;
        mywebsocket.send(data);
    }

    mywebsocket.onmessage = (event) => {
        setMessages(JSON.parse(event.data).data);
        document.getElementById("msg").value = "";
    };

    return (
        <div>
            <div className="App">
                <header className="App-header">
                    <div>
                        <Box
                            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <Card sx={{ width: 650, height: 490 }}>
                                <div style={{ textAlign: "left", width: 650, overflow: "scroll", height: 440 }}>
                                    <div style={{ display: "inline", marginLeft: "10px", float: "left" }}>
                                        <img src={`http://127.0.0.1:8000/getImg/${navigateLocation.state.item.photo}`}
                                            style={{ display: "inline", marginTop: "5px", height: "50px", width: "50px", borderRadius: "50%" }} alt="alt-img" />
                                    </div>
                                    <p style={{ display: "absolute", textAlign: "left", fontSize: "18px" }}>
                                        &nbsp;&nbsp;<b>{navigateLocation.state.item.first_name} {navigateLocation.state.item.last_name}</b>
                                    </p>
                                    <Divider />
                                    <Divider />
                                    {/* <button onClick={printFun}>Print Function</button> */}
                                    <div style={{ backgroundColor: "#dddada", height: "100%" }}>
                                        {messages.length > 0 && messages.map((chat_item, index) => {
                                            return (
                                                <div style={{ backgroundColor: "#dddada", }} key={chat_item.id}>
                                                    {
                                                        chat_item.sender === localStorage.getItem('user_email') ?
                                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                                <Card id="message_card" style={{ marginTop: "5px" }}>
                                                                    {chat_item.msg}
                                                                </Card>
                                                            </div>
                                                            :
                                                            <Card id="message_card" style={{ backgroundColor: "#a2c9fc" }}>
                                                                {chat_item.msg}
                                                            </Card>
                                                    }
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div style={{ textAlign: "left", display: "flex" }}>
                                    <TextField id="msg" variant="standard" placeholder='Type your message...' style={{ width: 530 }} />
                                    <Button onClick={sendMsg}>
                                        <TelegramIcon style={{ width: 60, height: 40 }} />
                                    </Button>
                                </div>
                            </Card>

                        </Box>
                    </div>
                </header>
            </div>
        </div>
    )
}

export default ChatRoom