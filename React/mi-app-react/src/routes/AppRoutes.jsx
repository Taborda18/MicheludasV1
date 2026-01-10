import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública - Login */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Redirigir la raíz al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Ruta para 404 - redirigir al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
