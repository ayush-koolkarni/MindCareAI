// App.tsx
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

const Stack = createNativeStackNavigator<any>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id="RootStack"
        initialRouteName="Main"
        screenOptions={{
          headerStyle: { backgroundColor: '#1C1C1E' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
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
          options={{ title: 'Victim Support Circle' }}
        />
        <Stack.Screen 
          name="SwitchCategory" 
          component={Screen3} 
          options={{ title: 'Switch Category' }}
        />
        <Stack.Screen 
          name="MentalHealthTests" 
          component={Screen4} 
          options={{ title: 'Mental Health Assessment' }}
        />
        <Stack.Screen 
          name="ProfessionalCare" 
          component={Screen5} 
          options={{ title: 'Professional Support' }}
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