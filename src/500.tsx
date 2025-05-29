import React from 'react';

const Error500 = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-5xl font-bold text-blue-500 mb-4">Error 500</h1>
      <p className="text-lg mb-6 text-center">
        El servidor no está disponible en este momento. Por favor, intenta nuevamente más tarde.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-900 transition duration-200"
        style={{color:"white"}}
      >
        Volver al inicio
      </a>
    </div>
  );
};

export default Error500;