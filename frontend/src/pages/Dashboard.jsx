import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Home, Activity, FileText, Menu, X, LogOut, Search, Database, Gift, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState({
    total_habitantes: 0,
    total_familias: 0
  });
  const [loading, setLoading] = useState(true);
  const [actividad, setActividad] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.role === 'vecino') {
      navigate('/perfil');
      return;
    }
    const fetchData = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([
          api.get('/api/v1/dashboard/'),
          api.get('/api/v1/actividad/')
        ]);
        setStatsData(statsRes.data);
        setActividad(actRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await api.get(`/api/v1/buscar/?query=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { name: 'Total Habitantes', value: statsData.total_habitantes || 0, icon: Users, color: 'bg-blue-500' },
    { name: 'Familias Registradas', value: statsData.total_familias || 0, icon: Home, color: 'bg-indigo-500' },
    { name: 'Casos de Salud', value: '0', icon: Activity, color: 'bg-rose-500' },
    { name: 'Beneficios Entregados', value: '0', icon: FileText, color: 'bg-emerald-500' },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Sidebar Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600 text-center leading-tight py-2">Portal de la comunidad<br/>La Resistencia I</h1>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Link to="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-blue-50 text-blue-700">
              <Activity className="mr-3 h-5 w-5" /> Resumen
            </Link>
            <Link to="/censo" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Users className="mr-3 h-5 w-5" /> Gestión de Censo
            </Link>
            <Link to="/reportes" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <BarChart className="mr-3 h-5 w-5" /> Reportes de Habitantes
            </Link>
            <Link to="/actividad" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <FileText className="mr-3 h-5 w-5" /> Actividad Reciente
            </Link>
            <Link to="/beneficios" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Gift className="mr-3 h-5 w-5" /> Beneficios e Inventario
            </Link>
            <Link to="/backup" className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
              <Database className="mr-3 h-5 w-5" /> Respaldos (DB)
            </Link>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">
              <LogOut className="mr-3 h-5 w-5" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <button className="lg:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg lg:max-w-xs relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all" 
                placeholder="Buscar por cédula o nombre..." 
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-100 max-h-60 overflow-y-auto">
                  {searchResults.map(res => (
                    <div key={res.cedula} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                      <p className="text-sm font-medium text-gray-900">{res.nombres} {res.apellidos}</p>
                      <p className="text-xs text-gray-500">C.I: {res.cedula}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Tabla de Control</h2>
              <p className="text-sm text-gray-500">Métricas principales de La Resistencia I</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((item) => (
                <div key={item.name} className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`p-3 rounded-xl ${item.color} bg-opacity-10`}>
                          <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} aria-hidden="true" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                          <dd className="text-2xl font-bold text-gray-900">{item.value}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions / Recent Activity placeholder */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {actividad.length > 0 ? actividad.map((act) => (
                  <div key={act.id} className="flex items-center p-4 bg-slate-50 rounded-xl">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {act.tipo.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{act.descripcion}</p>
                      <p className="text-xs text-gray-500">{new Date(act.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500">No hay actividad reciente.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
