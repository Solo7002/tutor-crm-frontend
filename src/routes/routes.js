import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import HomeStudent from "../pages/Home/HomeStudent";
import HometaskStudent from "../pages/Hometasks/HometaskStudent";
import MaterialsStudent from "../pages/Materials/MaterialsStudent";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="/StudentHome" element={<HomeStudent />} />
        <Route path="/StudentHometask" element={<HometaskStudent />} />
        <Route path="/StudentMaterials" element={<MaterialsStudent />} />
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Заглушка */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;