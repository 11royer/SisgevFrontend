import { createContext } from 'react';

// Aquí solo creamos el contexto. Al no ser un componente, Vite no intenta recargarlo.
export const AuthContext = createContext(null);