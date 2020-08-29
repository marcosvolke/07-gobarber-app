import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // UseState não pode ser async, então dificultou pegar as informações do async storage, precisei usar o useEffect (q tb não permite async)
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      // console.log(token[0]);
      // console.log(token[1]);
      // console.log(user[0]);
      // console.log(user[1]);

      if (token[1] && user[1]) {
        //define header padrao para todas as requisicoes - executa quando dá F5/refresh na página
        api.defaults.headers.authorization = `Bearer ${token[1]}`;

        setData({ user: JSON.parse(user[1]), token: token[1] });
      }

      setLoading(false);
    }

    loadStorageData();
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    // Executar de uma vez só para ser mais rápido:
    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
    // await AsyncStorage.setItem('@GoBarber:token', token);
    // await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

    //define header padrao para todas as requisicoes - executa quando loga
    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    // Executar de uma vez só para ser mais rápido:
    await AsyncStorage.multiRemove([
      '@GoBarber:token',
      '@GoBarber:user',
    ]);
    // await AsyncStorage.removeItem('@GoBarber:token');
    // await AsyncStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
