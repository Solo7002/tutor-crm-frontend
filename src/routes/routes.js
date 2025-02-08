import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/Auth/Login";
import HomeStudent from "../pages/Home/HomeStudent";
import HometaskStudent from "../pages/Hometasks/HometaskStudent";
import MaterialsStudent from "../pages/Materials/MaterialsStudent";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/StudentHome" element={<HomeStudent />} />
        <Route path="/StudentHometask" element={<HometaskStudent />} />
        <Route path="/StudentMaterials" element={<MaterialsStudent />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;