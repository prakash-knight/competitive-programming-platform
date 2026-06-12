// import { useState } from 'react'
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./routes/login";
import Home from "./ui/HomePage.jsx"; // <--- CHANGED
import Profile from "./routes/profile";
import Signup from "./routes/signup.jsx";
import Sheets from "./routes/sheets.jsx";
import Logout from "./routes/logout.jsx";
import Problem from "./routes/problem.jsx";

function ProfileRedirect() {
  const userid = localStorage.getItem("userid");
  return userid ? (
    <Navigate to={`/user/${userid}`} replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/sheets" element={<Sheets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/:userid" element={<Profile />} />
          <Route path="/profile" element={<ProfileRedirect />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/editor/:problemId" element={<Problem />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
