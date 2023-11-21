import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './component/home.js';
import AnimeDetails from './component/dettagliAnime.js';
import Login from './component/login.js';
import Registration from './component/registration.js';
import styles from './css.js'

const Stack = createStackNavigator();

const LoginButton = () => {
  const navigation = useNavigation()
  return (
    <Button
      onPress={() => {
        navigation.navigate('Login')
      }}
      title='Accedi'
      color="black"
    />
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50', // Colore di sfondo dell'header
          },
          headerTintColor: 'white', // Colore del testo dell'header
          headerTitleStyle: {
            fontWeight: 'bold', // Stile del testo del titolo dell'header
          },
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'La mia Home',
            headerRight: () => <LoginButton />,
          }}
        />
        <Stack.Screen
          name="Dettagli Anime"
          component={AnimeDetails}
          options={{
            title: 'Dettagli Anime',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: 'Accedi',
          }}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{
            title: 'Registrati',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}