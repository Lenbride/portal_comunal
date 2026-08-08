import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, FileText, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Censo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    sexo: 'M',
    telefono: '',
    necesidades_especiales: false,
    discapacidad: false,
    tipo_discapacidad: '',
    requiere_atencion_medica: false,
    tratamientos_medicos: '',
    codigo_vivienda: '',
    calle: 'Calle Primera de mayo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (e.target.name === 'cedula') {
      value = value.replace(/\D/g, '');
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validación de edad
    const ageDifMs = Date.now() - new Date(formData.fecha_nacimiento).getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    if (age < 18) {
      setError("El Jefe de Familia debe ser mayor de 18 años.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Formatear cédula
      const cedulaFormateada = `V-${formData.cedula}`; // Simplificación, habría que manejar V/E
      
      const payload = {
        cedula: cedulaFormateada,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        fecha_nacimiento: formData.fecha_nacimiento,
        sexo: formData.sexo,
        es_jefe_familia: true,
        necesidades_especiales: formData.necesidades_especiales,
        discapacidad: formData.discapacidad,
        tipo_discapacidad: formData.tipo_discapacidad,
        requiere_atencion_medica: formData.requiere_atencion_medica,
        tratamientos_medicos: formData.tratamientos_medicos
      };

      await api.post('/api/v1/habitantes/', payload);
      alert('Jefe de familia registrado exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Error capturado:", err);
      // Evitar pantalla en blanco mostrando mensaje visual
      setError(err.response?.data?.detail || 'Datos inválidos. Por favor, verifique la información.');
    } finally {
      setIsSubmitting(false);
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <UserPlus className="mr-3 h-6 w-6" /> Registro de Nuevo Censo
            </h2>
            <p className="mt-2 text-blue-100 opacity-90">Completa los datos del Jefe de Familia para registrar una nueva vivienda.</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula de Identidad</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <select name="nacionalidad" className="h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500">
                        <option>V-</option>
                        <option>E-</option>
                      </select>
                    </div>
                    <input type="text" name="cedula" id="cedula" value={formData.cedula} className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-xl py-3 border bg-gray-50" placeholder="12345678" required onChange={handleChange} />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <div className="mt-1">
                    <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" required onChange={handleChange} />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres</label>
                  <div className="mt-1">
                    <input type="text" name="nombres" id="nombres" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" required onChange={handleChange} />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <div className="mt-1">
                    <input type="text" name="apellidos" id="apellidos" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" required onChange={handleChange} />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
                  <div className="mt-1">
                    <input type="tel" name="telefono" id="telefono" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" onChange={handleChange} />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">Sexo</label>
                  <div className="mt-1">
                    <select id="sexo" name="sexo" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" onChange={handleChange}>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Datos de Vivienda</h3>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="calle" className="block text-sm font-medium text-gray-700">Calle / Sector</label>
                  <div className="mt-1">
                    <select id="calle" name="calle" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" onChange={handleChange} value={formData.calle}>
                      <option value="Calle Primera de mayo">Calle Primera de mayo</option>
                      <option value="Callejón primero de mayo">Callejón primero de mayo</option>
                      <option value="Calle las flores">Calle las flores</option>
                      <option value="Callejón las flores">Callejón las flores</option>
                      <option value="Calle democracia">Calle democracia</option>
                      <option value="Calle Arismendi">Calle Arismendi</option>
                      <option value="Avenida Raúl Leoni">Avenida Raúl Leoni</option>
                      <option value="Callejón la reforma">Callejón la reforma</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="codigo_vivienda" className="block text-sm font-medium text-gray-700">Número de Casa / Código</label>
                  <div className="mt-1">
                    <input type="text" name="codigo_vivienda" id="codigo_vivienda" className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-xl py-3 px-3 border bg-gray-50" required onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Salud y Condiciones Especiales</h3>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mb-6">
                <div className="sm:col-span-3 flex items-center">
                  <input id="discapacidad" name="discapacidad" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" onChange={handleChange} checked={formData.discapacidad} />
                  <label htmlFor="discapacidad" className="ml-3 font-medium text-gray-700">Posee Discapacidad</label>
                </div>
                {formData.discapacidad && (
                  <div className="sm:col-span-3">
                    <label htmlFor="tipo_discapacidad" className="block text-sm font-medium text-gray-700">Tipo de Discapacidad</label>
                    <input type="text" name="tipo_discapacidad" id="tipo_discapacidad" className="mt-1 block w-full rounded-xl border-gray-300 py-3 px-3 border bg-gray-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" onChange={handleChange} />
                  </div>
                )}
                
                <div className="sm:col-span-3 flex items-center mt-4 sm:mt-0">
                  <input id="requiere_atencion_medica" name="requiere_atencion_medica" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" onChange={handleChange} checked={formData.requiere_atencion_medica} />
                  <label htmlFor="requiere_atencion_medica" className="ml-3 font-medium text-gray-700">Requiere Atención Médica</label>
                </div>
                {formData.requiere_atencion_medica && (
                  <div className="sm:col-span-3 mt-4 sm:mt-0">
                    <label htmlFor="tratamientos_medicos" className="block text-sm font-medium text-gray-700">¿Qué enfermedad tiene?</label>
                    <input type="text" name="tratamientos_medicos" id="tratamientos_medicos" className="mt-1 block w-full rounded-xl border-gray-300 py-3 px-3 border bg-gray-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" onChange={handleChange} />
                  </div>
                )}
              </div>

              <div className="pt-5 border-t border-gray-200 flex justify-end">
                <button type="button" onClick={() => navigate('/dashboard')} disabled={isSubmitting} className="bg-white py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 disabled:opacity-50">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Censo;
