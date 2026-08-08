import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Printer, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const Actividad = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const res = await api.get('/api/v1/actividad/');
        setActividades(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchActividad();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between no-print">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Volver al Dashboard
          </button>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Printer className="h-5 w-5 mr-2" /> Imprimir Reporte
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none">
          <div className="border-b border-gray-200 pb-5 mb-5 flex items-center">
            <Activity className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Actividad Reciente</h2>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : actividades.length > 0 ? (
              actividades.map((act) => (
                <div key={act.id} className="flex items-start p-4 bg-gray-50 rounded-xl print:bg-white print:border print:border-gray-200">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{act.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(act.fecha).toLocaleString()} - Registrado por: {act.usuario}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No hay registros de actividad recientes.</p>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
};

export default Actividad;
