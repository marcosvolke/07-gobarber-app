import React from 'react';
import { View, StatusBar } from 'react-native';

const App: React.FC = () => (
  <>
    {/* só no android tem algumas opções a mais na status bar como backroundColor */}
    {/* a opção translucent deixa a barra transparente usando o fundo do app, a hidden esconde */}
    <StatusBar barStyle="light-content" backgroundColor="#312e38"  />
    <View style={{ flex: 1, backgroundColor: '#312e38' }} />
  </>
);

export default App;
