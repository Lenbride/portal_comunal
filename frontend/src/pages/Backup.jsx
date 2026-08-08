import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Download, Upload, ArrowLeft, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Backup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleExport = async () => {
    setIsExporting(true);
    setMessage('');
    setError('');
    try {
      // Usamos responseType blob para descargar el archivo .db
      const response = await api.get('/api/v1/backup/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portal_comunal_backup_${new Date().toISOString().split('T')[0]}.db`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setMessage('Respaldo descargado exitosamente.');
    } catch (err) {
      setError('Error al generar el respaldo de la base de datos.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestore = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo de respaldo (.db)');
      return;
    }

    if (!window.confirm('¡ADVERTENCIA CRÍTICA! Esta acción reemplazará toda la base de datos actual con los datos del respaldo. Todos los datos nuevos desde el respaldo se perderán. ¿Estás absolutamente seguro de continuar?')) {
      return;
    }

    setIsRestoring(true);
    setMessage('');
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/api/v1/backup/restore', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Base de datos restaurada exitosamente. Es posible que debas iniciar sesión nuevamente.');
      setFile(null);
    } catch (err) {
      setError('Error al restaurar la base de datos. Verifica que el archivo sea válido.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Volver al Dashboard
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <Database className="mr-3 h-6 w-6" /> Gestión de Respaldos
            </h2>
            <p className="mt-2 text-gray-300">Administra las copias de seguridad de la base de datos del sistema.</p>
          </div>

          <div className="p-8 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}

            <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <Download className="mr-2 h-5 w-5 text-blue-600" /> Exportar Base de Datos
              </h3>
              <p className="text-sm text-gray-600 mb-4">Descarga una copia completa de la base de datos actual para resguardar la información.</p>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isExporting ? 'Generando...' : 'Descargar Respaldo (.db)'}
              </button>
            </div>

            <div className="border border-red-200 rounded-2xl p-6 bg-red-50">
              <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center">
                <Upload className="mr-2 h-5 w-5 text-red-600" /> Restaurar Base de Datos
              </h3>
              <p className="text-sm text-red-700 mb-4 font-medium flex items-start">
                <AlertTriangle className="h-5 w-5 mr-1 flex-shrink-0" />
                Atención: Esta acción es irreversible y sobrescribirá los datos actuales.
              </p>
              
              <form onSubmit={handleRestore} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input 
                  type="file" 
                  accept=".db,.sqlite"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
                />
                <button 
                  type="submit"
                  disabled={isRestoring || !file}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  {isRestoring ? 'Restaurando...' : 'Restaurar Respaldo'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Backup;
