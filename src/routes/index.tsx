import React from 'react';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../context/AuthContext';

const Routes: React.FC = () => {
  // se eu tiver usuário dentro do provider, tá logado, passo as rotas do app, senão passo as rotas de auth
  const { user } = useAuth();

  return user ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
