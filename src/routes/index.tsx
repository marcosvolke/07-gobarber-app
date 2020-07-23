import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

import { useAuth } from '../context/AuthContext';

const Routes: React.FC = () => {
  // se eu tiver usuário dentro do provider, tá logado, passo as rotas do app, senão passo as rotas de auth
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
}

export default Routes;
