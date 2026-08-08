import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Key, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const RecuperarCuenta = () => {
  const [step, setStep] = useState(1);
  const [cedula, setCedula] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const solicitarCodigo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/api/v1/auth/recover-account', { cedula });
      setStep(2);
      setSuccess('Se ha validado la cédula. En un entorno real se enviaría un SMS o Correo. Usa el código de seguridad predeterminado: 123456');
    } catch (err) {
      setError(err.response?.data?.detail || 'Usuario no encontrado o error en el sistema.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificarYCambiar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/api/v1/auth/reset-password', { cedula, codigo, nueva_clave: nuevaClave });
      setSuccess('Contraseña actualizada con éxito. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Código inválido o error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <button onClick={() => navigate('/login')} className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver al Login
          </button>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Recuperar Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 ? 'Ingresa tu cédula para validar tu identidad.' : 'Ingresa el código de seguridad y tu nueva contraseña.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={solicitarCodigo}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-50"
                  placeholder="Cédula (ej. V-12345678)"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Verificando...' : 'Validar Identidad'}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={verificarYCambiar}>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                  placeholder="Código de seguridad"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                  placeholder="Nueva contraseña"
                  value={nuevaClave}
                  onChange={(e) => setNuevaClave(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecuperarCuenta;
