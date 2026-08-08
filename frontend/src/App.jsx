import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Censo from './pages/Censo'
import Perfil from './pages/Perfil'
import RecuperarCuenta from './pages/RecuperarCuenta'
import Reportes from './pages/Reportes'
import Actividad from './pages/Actividad'
import Backup from './pages/Backup'
import Beneficios from './pages/Beneficios'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-admin" element={<Login />} />
          <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/censo" 
            element={
              <ProtectedRoute>
                <Censo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/perfil" 
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reportes" 
            element={
              <ProtectedRoute>
                <Reportes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/actividad" 
            element={
              <ProtectedRoute>
                <Actividad />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/backup" 
            element={
              <ProtectedRoute>
                <Backup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/beneficios" 
            element={
              <ProtectedRoute>
                <Beneficios />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
