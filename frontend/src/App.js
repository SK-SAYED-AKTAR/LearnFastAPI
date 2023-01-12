import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import UpdateUser from "./components/Dashboard/UpdateUser";
import AddFriend from "./components/Dashboard/AddFriend";
import MyFriend from "./components/Dashboard/MyFriend";
import Inbox from "./components/Dashboard/Inbox";
import ChatRoom from "./components/Dashboard/Chat/Chatroom";

import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='dashboard' element={<Dashboard/>}>
          <Route path='update-user' element={<UpdateUser/>}/>
          <Route path='add-friend' element={<AddFriend/>}/>
          <Route path='my-friend' element={<MyFriend/>}/>
          <Route path='inbox' element={<Inbox/>}/>
          <Route path='chatroom' element={<ChatRoom/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

