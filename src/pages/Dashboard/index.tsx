import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
// import { Button } from 'react-native';

import { useAuth } from '../../context/AuthContext';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
} from './styles';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          {/* quebra de linha \n */}
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{ uri: user.avatar_url }} />
        </ProfileButton>
      </Header>

      {/* <Button title="Sair" onPress={signOut} /> */}
    </Container>
  );
}

export default Dashboard;
