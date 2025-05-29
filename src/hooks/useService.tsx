import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Tipo genérico para el estado de la respuesta
 * @template T - Tipo de datos esperado de la respuesta
 */
type ServiceState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  statusCode?: number;
};

/**
 * Hook genérico optimizado para consumir servicios y evitar re-renderizados innecesarios
 */
const useService = <T,>(
  serviceFunction: (...args: any[]) => Promise<T>,
  serviceParams: any[] = [],
  dependencies: any[] = [],
  executeOnMount = true,
  errorHandler?: (error: Error) => void
) => {
  // Estado con tipo genérico
  const [state, setState] = useState<ServiceState<T>>({
    data: null,
    loading: false,
    error: null
  });

  // Usar un ref para el montado en lugar de un estado
  const isMountedRef = useRef(true);
  
  // Ref para las solicitudes en curso
  const pendingRequestRef = useRef<Promise<T | null> | null>(null);

  // Función para ejecutar el servicio
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Si ya hay una solicitud en curso, no iniciamos otra
      if (pendingRequestRef.current) {
        return pendingRequestRef.current;
      }
      
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Utiliza los argumentos proporcionados al execute o los serviceParams por defecto
        const paramsToUse = args.length > 0 ? args : serviceParams;
        
        // Guardamos la promesa en curso
        pendingRequestRef.current = serviceFunction(...paramsToUse);
        const response = await pendingRequestRef.current;
        
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (isMountedRef.current) {
          setState(prev => ({ ...prev, loading: false, data: response }));
        }
        
        // Limpiamos la referencia a la solicitud
        pendingRequestRef.current = null;
        return response;
      } catch (error) {
        // Manejo de errores
        const errorObject = error instanceof Error ? error : new Error('Unknown error');
        
        // Extraer código de estado HTTP si está disponible
        let statusCode:number;
        if (error && typeof error === 'object' && 'response' in error) {
          statusCode = (error as any).response?.status;
        }
        
        // Si hay un manejador de errores personalizado, úsalo
        if (errorHandler) {
          errorHandler(errorObject);
        }
        
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (isMountedRef.current) {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: errorObject,
            statusCode
          }));
        }
        
        // Limpiamos la referencia a la solicitud
        pendingRequestRef.current = null;
        return null;
      }
    },
    // Memoizamos la función con las dependencias correctas
    [serviceFunction, errorHandler, JSON.stringify(serviceParams)]
  );

  // Limpieza al desmontar el componente
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Ejecutar el servicio al montar el componente si executeOnMount es true
  useEffect(() => {
    if (executeOnMount && isMountedRef.current) {
      execute();
    }
    // Solo dependemos de execute y executeOnMount
    // Evitamos agregar dependencies al array para prevenir ejecuciones en ciclo
  }, [execute, executeOnMount]);

  // Efecto adicional para cuando cambian las dependencias explícitas
  useEffect(() => {
    if (isMountedRef.current && dependencies.length > 0) {
      execute();
    }
  }, [...dependencies]);

  return {
    ...state,
    execute,
    // Helpers adicionales
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data,
    statusCode: state.statusCode,
    // Método para limpiar el estado
    reset: () => {
      setState({ data: null, loading: false, error: null });
      pendingRequestRef.current = null;
    }
  };
};

export default useService;