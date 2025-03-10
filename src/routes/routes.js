import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import ForgotPassword from "../features/Auth/ForgotPassword";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Navbar from "../layouts/Navbar";
import HomeStudent from "../pages/Home/HomeStudent";
import HometaskStudent from "../pages/Hometasks/HometaskStudent";
import MaterialsStudent from "../pages/Materials/MaterialsStudent";
import TestStudent from "../pages/Tests/TestStudent"
import ProfileTeacher from "../pages/Profile/ProfileTeacher";
import RunTestStudent from "../pages/Tests/RunTestStudent";
import DoneTestStudent from "../pages/Tests/DoneTestStudent";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/test/:encryptedTestId" element={<RunTestStudent />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<Navbar />}>
          <Route path="home" element={<HomeStudent />} />
          <Route path="hometask" element={<HometaskStudent />} />
          <Route path="materials" element={<MaterialsStudent />} />
          <Route path="tests" element={<TestStudent />}/>
          <Route path="tests/complete/:encryptedTestId" element={<DoneTestStudent />}/>
          {/* <Route path="tests" element={<TestsStudent />} /> */}
          {/* <Route path="calendar" element={<CalendarStudent />} /> */}
          {/* <Route path="reviews" element={<ReviewsStudent />} /> */}
          {/* <Route path="payments" element={<PaymentsStudent />} /> */}
          {/* <Route path="search" element={<SearchStudent />} /> */}
          {/* <Route path="info" element={<InfoStudent />} /> */}
          {/* <Route path="settings" element={<SettingsStudent />} /> */}
          {/* <Route path="profile" element={<ProfileStudent />} /> */}
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<Navbar />}>
          {/* <Route path="home" element={<HomeTeacher />} /> */}
          {/* <Route path="tasks" element={<TasksTeacher />} /> */}
          {/* <Route path="materials" element={<MaterialsTeacher />} /> */}
          {/* <Route path="tests" element={<TestsTeacher />} /> */}
          {/* <Route path="calendar" element={<CalendarTeacher />} /> */}
          {/* <Route path="reviews" element={<ReviewsTeacher />} /> */}
          {/* <Route path="payments" element={<PaymentsTeacher />} /> */}
          {/* <Route path="search" element={<SearchTeacher />} /> */}
          {/* <Route path="info" element={<InfoTeacher />} /> */}
          {/* <Route path="settings" element={<SettingsTeacher />} /> */}
          <Route path="profile" element={<ProfileTeacher />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} /> {/* Заглушка */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;