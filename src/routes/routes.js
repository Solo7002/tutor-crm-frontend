import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import ForgotPassword from "../features/Auth/ForgotPassword";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Navbar from "../layouts/Navbar/Navbar";

import HomeStudent from "../pages/Home/HomeStudent/HomeStudent";
import HometaskStudent from "../pages/Hometasks/HometaskStudent";
import MaterialsStudent from "../pages/Materials/MaterialsStudent";
import TestStudent from "../pages/Tests/TestStudent";
import ProfileTeacher_forStudent from "../pages/Profile/ProfileTeacher_forStudent";
import CalendarStudent from "../pages/Calendar/CalendarStudent/CalendarStudent";
import RunTestStudent from "../pages/Tests/RunTestStudent";
import DoneTestStudent from "../pages/Tests/DoneTestStudent";
import SearchTeachers from "../pages/SearchTeachers/SearchTeachers";
import ProfileStudent from "../pages/Profile/ProfileStudent";
import EditEmailAndPassword from "../pages/EditProfile/EditEmailAndPassword";
import EditProfile from "../pages/EditProfile/EditProfile";

import HomeTeacher from "../pages/Home/HomeTeacher/HomeTeacher";
import HometaskTeacher from "../pages/Hometasks/Teacher/HometaskTeacher";
import MaterialsTeacher from "../pages/Materials/Teacher/MaterialsTeacher";
import TestsTeacher from "../pages/TestsTeacher/TestsTeacher";
import TestResults from "../pages/TestsTeacher/TestResults";
import CreateTest from "../pages/TestsTeacher/CreateTest";
import CreateTestAi from "../pages/TestsTeacher/CreateTestAi";
import CalendarTeacher from "../pages/Calendar/CalendarTeacher/CalendarTeacher";
import Course from "../pages/Course/Course";
import ProfileTeacher from "../pages/Profile/ProfileTeacher";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
};

const RoleBasedRoute = ({ allowedRole, children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          
          const response = await axios.get(`http://localhost:4000/api/users/isTeacher/${userId}`);
          const isTeacher = response.data.isTeacher;
          
          setUserRole(isTeacher ? "teacher" : "student");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userRole !== allowedRole) {
    return <Navigate to={userRole === "teacher" ? "/teacher/home" : "/student/home"} replace />;
  }

  return children;
};

const TestAccessRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          
          const response = await axios.get(`http://localhost:4000/api/users/isTeacher/${userId}`);
          const isTeacher = response.data.isTeacher;
          
          setUserRole(isTeacher ? "teacher" : "student");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userRole === "teacher") {
    return <Navigate to="/teacher/home" replace />;
  }

  return children;
};


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        <Route path="test/:encryptedTestId" element={
          <ProtectedRoute>
            <TestAccessRoute>
              <RunTestStudent />
            </TestAccessRoute>
          </ProtectedRoute>
        } />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/student" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="student">
              <Navbar />
            </RoleBasedRoute>
          </ProtectedRoute>
        }>
          <Route path="home" element={<HomeStudent />} />
          <Route path="teacher_profile/:encryptedTeacherId" element={<ProfileTeacher_forStudent />} />
          <Route path="hometask" element={<HometaskStudent />} />
          <Route path="materials" element={<MaterialsStudent />} />
          <Route path="tests" element={<TestStudent />} />
          <Route path="tests/complete/:encryptedTestId" element={<DoneTestStudent />} />
          <Route path="calendar" element={<CalendarStudent />} />
          <Route path="search" element={<SearchTeachers />} />
          <Route path="profile" element={<ProfileStudent />} />
        </Route>

        <Route path="/teacher" element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRole="teacher">
              <Navbar />
            </RoleBasedRoute>
          </ProtectedRoute>
        }>
          <Route path="home" element={<HomeTeacher />} />
          <Route path="hometasks" element={<HometaskTeacher />} />
          <Route path="materials" element={<MaterialsTeacher />} />
          <Route path="tests" element={<TestsTeacher />} />
          <Route path="tests/results/:encodedTestId" element={<TestResults />} />
          <Route path="tests/create/:encodedGroupId" element={<CreateTest />} />
          <Route path="tests/create-ai/:encodedGroupId" element={<CreateTestAi />} />
          <Route path="calendar" element={<CalendarTeacher />} />
          <Route path="courses" element={<Course />} />
          <Route path="profile" element={<ProfileTeacher />} />
        </Route>

        <Route path="/user" element={ <Navbar />}>
            <Route path="edit" element={<EditProfile />} />
            <Route path="edit/credentials" element={<EditEmailAndPassword />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;