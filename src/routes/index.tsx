import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Spin } from "antd";

//Carga normal
import Home from "../home";

//Carga perezosa de la página
const Error500 = lazy(() => import("../500"));
const Error404 = lazy(() => import("../404"));

const Configuracion = lazy(
  () => import("../modulos/Administracion/Configuracion")
);

// Componente para mostrar durante la carga de componentes lazy
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-full w-full py-8">
    <Spin size="large" tip="Cargando..." />
  </div>
);

// Layout - Mientras el contenido se carga presenta un spinner
const Layout = () => {
  const location = useLocation();
  // Efecto para manejar navegación - lo ideal en una SPA es mantener el estado durante la navegación
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen p-4">
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

// Proteccion de rutas
const ProtectedRoute = ({ children }: any) => {
  // Implementar verificación de autenticación
  const cokkieAuth = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("authToken"))
    ?.replace("authToken=", "");

  const isAuthenticated = cokkieAuth !== undefined; //Para mayor seguridad enviar el token al API SSO y verificarlo (POST:/api/Usuario/ValidarJWT)

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />; //Navegar a la pagina de incio
  }

  return children;
};

//Rutas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/500" element={<Error500 />} />
      <Route path="/404" element={<Error404 />} />
      {/*Rutas protegidas con layout (PONER EL NOMBRE DEL PRODUCTO al path padre)*/}
      <Route
        path="/Dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="Administracion/Configuracion"
          element={<Configuracion />}
        />
      </Route>
      {/* Catch-all para cualquier ruta no encontrada */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
export default AppRoutes;
