import axios from 'axios';

// Crear una instancia de axios
const axiosInstance = axios.create({
  //baseURL: process.env.REACT_APP_API_FC, // Reemplaza con tu URL base
  timeout: 10000,
});

// Función para obtener el token del localStorage
const getAuthToken = () => {
  return document.cookie
          .split(";")
          .map((cookie) => cookie.trim())
          .find((cookie) => cookie.startsWith("authToken"))?.replace("authToken=", "");
};

// Agregar un interceptor para las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y redireccionar en caso de error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.error('Error de red detectado. Redirigiendo a /500.');
      
      // Evita que el error se propague a React y fuerza la redirección
      window.location.href = '/500';
      
      return new Promise(() => {}); // Retorna una promesa vacía para evitar que se propague
    }

    if (error.response?.status === 401) {
      console.error('Sesión expirada o token inválido');
      localStorage.removeItem('authToken');
      window.location.href = '/login';//Redirige a tu pagina de inicio/default page
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
