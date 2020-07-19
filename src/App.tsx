import 'react-native-gesture-handler';

import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    {/* só no android tem algumas opções a mais na status bar como backroundColor */}
    {/* a opção translucent deixa a barra transparente usando o fundo do app, a hidden esconde */}
    <StatusBar barStyle="light-content" backgroundColor="#312e38"  />
    <View style={{ flex: 1, backgroundColor: '#312e38' }}>
      <Routes />
    </View>
  </NavigationContainer>
);

export default App;
