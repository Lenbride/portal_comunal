import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Home, Activity, LogOut } from 'lucide-react';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
              {user?.username?.[0] || 'V'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Perfil Vecinal</h1>
              <p className="text-gray-500">C.I: {user?.username}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" /> Salir
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos Personales */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-blue-600">
              <User className="mr-2 h-5 w-5" />
              <h2 className="text-lg font-bold">Datos Personales</h2>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold text-gray-700">Estado:</span> <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">Activo</span></p>
              <p><span className="font-semibold text-gray-700">Teléfono:</span> No registrado</p>
              <p><span className="font-semibold text-gray-700">Rol:</span> Jefe de Familia</p>
            </div>
            <button onClick={() => alert("Módulo en construcción")} className="mt-6 w-full py-2 bg-gray-50 text-blue-600 font-medium rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
              Editar Perfil
            </button>
          </div>

          {/* Núcleo Familiar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-indigo-600">
              <Home className="mr-2 h-5 w-5" />
              <h2 className="text-lg font-bold">Núcleo Familiar</h2>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold text-gray-700">Cargas Familiares:</span> 0</p>
              <p><span className="font-semibold text-gray-700">Vivienda:</span> No asignada</p>
            </div>
            <button onClick={() => alert("Módulo en construcción")} className="mt-6 w-full py-2 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100">
              Gestionar Familia
            </button>
          </div>

          {/* Estado de Salud y Beneficios */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4 text-rose-600">
              <Activity className="mr-2 h-5 w-5" />
              <h2 className="text-lg font-bold">Salud y Beneficios</h2>
            </div>
            <div className="text-sm text-gray-500">
              <p>No hay beneficios ni condiciones de salud registradas para este grupo familiar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
