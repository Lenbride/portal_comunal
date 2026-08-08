import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    
    if (isRegistering) {
      const success = await register(username, password);
      setIsSubmitting(false);
      if (success) {
        setSuccessMessage('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
        setIsRegistering(false);
        setUsername('');
        setPassword('');
      }
    } else {
      const success = await login(username, password);
      setIsSubmitting(false);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500 blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px] opacity-30"></div>
      </div>

      <div className="z-10 w-full max-w-md p-8 glassmorphism rounded-3xl animate-fade-in-up">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal Comunal</h1>
          <p className="text-gray-500">Sector La Resistencia I</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-md flex items-start">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white bg-opacity-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Cédula (ej. V-12345678)"
              value={username}
              onChange={(e) => {
                let val = e.target.value.toUpperCase();
                // Si no empieza con V- ni E-, forzamos V- por defecto al escribir
                if (val.length === 1 && /[0-9]/.test(val)) {
                  val = 'V-' + val;
                } else if (val.length === 1 && (val === 'V' || val === 'E')) {
                  val = val + '-';
                }
                setUsername(val);
              }}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-white bg-opacity-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 group`}
          >
            {isSubmitting ? (isRegistering ? 'Registrando...' : 'Verificando...') : (isRegistering ? 'Crear Cuenta' : 'Ingresar al Sistema')}
            {!isSubmitting && !isRegistering && <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-6 text-center flex flex-col space-y-3">
          <button 
            type="button" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setSuccessMessage('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            {isRegistering ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </button>
          
          <button 
            type="button" 
            onClick={() => navigate('/recuperar-cuenta')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña? / Recuperar cuenta
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20 text-center flex flex-col space-y-2">
          <button 
            type="button" 
            onClick={() => navigate('/login-admin')}
            className="text-gray-500 hover:text-gray-700 text-xs font-medium transition-colors"
          >
            ¿Eres administrador?
          </button>
          <p className="text-xs text-gray-400">Protegido bajo la Ley de Infogobierno</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
