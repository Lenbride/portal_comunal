import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Printer, ArrowLeft, Filter } from 'lucide-react';
import api from '../services/api';

const Reportes = () => {
  const [habitantes, setHabitantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');
  const [filtroSector, setFiltroSector] = useState('Todos');
  const [filtroAnio, setFiltroAnio] = useState('Todos');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHabitantes = async () => {
      try {
        const res = await api.get('/api/v1/habitantes/?limit=1000');
        setHabitantes(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHabitantes();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getSectoresUnicos = () => {
    // Si los habitantes tuvieran el campo de calle adjunto, se extraerían de aquí.
    return ['Todos', 'Calle Primera de mayo', 'Callejón primero de mayo', 'Calle las flores', 'Callejón las flores', 'Calle democracia', 'Calle Arismendi', 'Avenida Raúl Leoni', 'Callejón la reforma'];
  };

  const getAniosUnicos = () => {
    const anios = habitantes.map(h => new Date(h.fecha_nacimiento).getFullYear());
    return ['Todos', ...new Set(anios)].sort();
  };

  const habitantesFiltrados = habitantes.filter(h => {
    const matchAnio = filtroAnio === 'Todos' || new Date(h.fecha_nacimiento).getFullYear().toString() === filtroAnio.toString();
    // En un sistema real se filtrarían por el estado y sector asociado a la familia
    return matchAnio; 
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Volver al Dashboard
          </button>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Printer className="h-5 w-5 mr-2" /> Imprimir Reporte
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none print:p-0">
          <div className="border-b border-gray-200 pb-5 mb-5 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Reporte de Habitantes</h2>
            <p className="text-gray-500">Portal de la comunidad La Resistencia I</p>
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 no-print bg-gray-50 p-4 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estatus</label>
              <select value={filtroEstatus} onChange={e => setFiltroEstatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                <option>Todos</option>
                <option>Activos</option>
                <option>Inactivos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sector / Calle</label>
              <select value={filtroSector} onChange={e => setFiltroSector(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                {getSectoresUnicos().map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Año de Nacimiento (Histórico)</label>
              <select value={filtroAnio} onChange={e => setFiltroAnio(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm">
                {getAniosUnicos().map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 print:bg-transparent">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres y Apellidos</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Nac.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4">Cargando...</td></tr>
                ) : habitantesFiltrados.length > 0 ? (
                  habitantesFiltrados.map((h) => (
                    <tr key={h.cedula}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.cedula}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.nombres} {h.apellidos}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.fecha_nacimiento}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.sexo}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-4">No se encontraron habitantes con estos filtros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        }
      `}</style>
    </div>
  );
};

export default Reportes;
