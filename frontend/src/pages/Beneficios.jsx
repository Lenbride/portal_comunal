import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowLeft } from 'lucide-react';

const Beneficios = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Volver al Dashboard
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="border-b border-gray-200 pb-5 mb-5 flex items-center">
            <Gift className="h-8 w-8 text-emerald-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Beneficios e Inventario</h2>
          </div>
          
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Este módulo de consulta está en desarrollo.</p>
            <p className="text-gray-400 text-sm mt-2">Próximamente podrás visualizar el registro de entregas CLAP, gas y medicinas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beneficios;
