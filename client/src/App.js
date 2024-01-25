import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Compose from "./pages/Compose";
import Sent from "./pages/Sent";
import Draft from "./pages/Draft";
import Trash from "./pages/Trash";
import Home from "./pages/Home";
import Email from "./components/Email1";
// import Homee from "./pages/Homee";
import DetailedEmail from "./pages/DetailedEmail"
import ProfileLayout from "./pages/ProfileLayout";
import PasswordUpdate from "./pages/PasswordUpdate";
import ResetPassword from "./pages/ResetPassword";
import ResetEmail from "./pages/ResetEmail";
import StartVideoMeeting from "./pages/StartVideoMeeting";
import VideoMeeting from "./pages/VideoMeeting";
import VideoCall from "./pages/VideoCall";
import ProfileHome from "./pages/ProfileHome";
import ProfilePicture from "./pages/ProfilePicture";
import MessengerLayout from "./pages/MessengerLayout";
import Messenger from "./pages/Messenger";
import ContactsLayout from "./pages/ConatctsLayout";
import Contacts from "./pages/Conatcts";
import Group from "./components/Group"
import JournalAppels from "./components/JournalAppels"
import Page404 from "./pages/Page404"
import Meet from "./pages/MeetPage"

function App() {
  const getProfile = () => {
    if (!localStorage["email"]) {
      const instance = axios.create({
        withCredentials: true,
      });

      instance
        .get(`${process.env.REACT_APP_API_LINK}users/get-user`)
        .then(function (res) {
          localStorage.setItem("user_id", res.data._id);
          localStorage.setItem("email", res.data.email);
        });
    }
  };

  useEffect(() => {
    // getProfile()
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        {/* <Route path="/Homee" element={<Homee />}></Route> */}
        <Route path="/Meet" element={<Meet />}></Route>
        <Route path="/Home" element={<Home />}></Route>
          <Route path="/start-video-meeting" element={<StartVideoMeeting />}></Route>
          <Route path="/video-meeting/:roomID" element={<VideoMeeting />}>
          </Route>
          <Route path="/reset-email" element={<ResetEmail />}></Route>
          <Route path="/Page404" element={<Page404 />}></Route>
          <Route path="/reset-password/:resetCode" element={<ResetPassword />}></Route>
          <Route path="/contacts/" element={<ContactsLayout />}>
            <Route index element={<Contacts />}></Route>
          </Route>
          <Route path="/messenger/" element={<MessengerLayout />}>
            <Route index element={<Messenger />}></Route>
            <Route path="/messenger/calls-journal" element={<JournalAppels />}></Route>
          </Route>
          <Route path="/profile/" element={<ProfileLayout />}>
            <Route index element={<ProfileHome />}></Route>
            <Route path="/profile/update-profile" element={<Profile />}></Route>
            <Route path="/profile/update-password" element={<PasswordUpdate />}></Route>
            <Route path="/profile/update-pp" element={<ProfilePicture />}></Route>
          </Route>
          <Route path="/Register" element={<Register />}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Group" element={<Group />}></Route>
          <Route path="/" element={<Layout />}>

          <Route path="/DetailedEmail/:mailId" element={<DetailedEmail />}></Route>
          <Route path="/Email/:mailId" element={<Email />}></Route>
            <Route path="/compose" element={<Compose />}></Route>
            <Route path="/inbox" element={<Inbox />}></Route>
            <Route path="/drafts" element={<Draft />}></Route>
            <Route path="/trash" element={<Trash />}></Route>
            <Route path="/sent" element={<Sent />}></Route>
            <Route path="/video-call" element={<VideoCall />}></Route>
            <Route index element={<Inbox />}></Route>
          </Route>
          {/* <Route path="/chat" element={<Chat />}>
            <Route index element={<Chat />}></Route>
          </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
