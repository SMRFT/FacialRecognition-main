import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Admin from "./Admin";
import Adminlogin from "./Adminlogin";
import Newhome from "./Components/Newhome";
import Viewemp from "./Components/Viewemp";
import AdminCalendar from "./Components/AdminCalendar";
import WebcamCaptureLogout from "./Components/WebcamCaptureLogout";
import WebcamCaptureLogin from "./Components/WebcamCaptureLogin";
import Break from "./Components/Break";
import Breakstart from "./Components/Breakstart";
import Breakend from "./Components/Breakend";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/Admin/*" element={<Admin />} />
      <Route path="/adminlogin/*" element={<Adminlogin />} />
      <Route path="/WebcamCaptureLogin/*" element={<WebcamCaptureLogin />} />
      <Route path="/WebcamCaptureLogout/*" element={<WebcamCaptureLogout />} />
      <Route path="/Break/*" element={<Break />} />
      <Route path="/Breakstart/*" element={<Breakstart />} />
      <Route path="/Breakend/*" element={<Breakend />} />
      <Route path="/AdminCalendar/:name" element={<AdminCalendar />} />
    </Routes>
  </BrowserRouter>
);
