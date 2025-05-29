import React from 'react';

const Error404 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-5xl font-bold text-red-500 mb-4">Error 404</h1>
      <p className="text-lg mb-6 text-center">
        La página que buscas no existe o ha sido movida. Por favor, verifica la URL o regresa al inicio.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-red-500 text-black rounded hover:bg-red-900 transition duration-200"
      >
        <p className='text-black'>Volver al inicio</p>
      </a>
    </div>
  );
};

export default Error404;
