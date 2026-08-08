import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Intentar recuperar el usuario del token al cargar la app
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      const response = await api.post('/api/v1/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Por ahora, simularemos los datos del usuario basándonos en el username
      const role = username === 'V-00000000' ? 'admin' : 'vecino';
      const userData = { username, role };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (err) {
      console.error("Login error", err);
      setError(err.response?.data?.detail || 'Error de autenticación. Verifica tus credenciales.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/api/v1/usuarios/', {
        username,
        password,
        rol: 'vecino'
      });
      return true;
    } catch (err) {
      console.error("Register error", err);
      setError(err.response?.data?.detail || 'Error al registrar usuario.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
