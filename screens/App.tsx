//App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import Screen1 from './ResourceLibrary';
import Screen2 from './PeerSupport';
import Screen3 from './SwitchCategory';
import Screen4 from './MentalHealthTests';
import Screen5 from './ProfessionalCare';
import Screen6 from './SuccessNetwork';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResourceLibrary" 
          component={Screen1} 
          options={{ title: 'Resource Library' }}
        />
        <Stack.Screen 
          name="PeerSupport" 
          component={Screen2} 
          options={{ title: 'Peer Support' }}
        />
        <Stack.Screen 
          name="SwitchCategory" 
          component={Screen3} 
          options={{ title: 'Switch Category' }}
        />
        <Stack.Screen 
          name="MentalHealthTests" 
          component={Screen4} 
          options={{ title: 'Mental Health Tests' }}
        />
        <Stack.Screen 
          name="ProfessionalCare" 
          component={Screen5} 
          options={{ title: 'Professional Care' }}
        />
        <Stack.Screen 
          name="SuccessNetwork" 
          component={Screen6} 
          options={{ title: 'Success Network' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}