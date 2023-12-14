import { API } from './Config'
import { useState, useEffect } from 'react'
import { Alert, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Home from './component/home.js'
import AnimeDetails from './component/dettagliAnime.js'
import Login from './component/login.js'
import Singin from './component/singin.js'
import MyList from './component/mylist.js'
import Settings from './component/settings.js'
import styles from './css.js'

const Stack = createStackNavigator()

const LoginButton = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Login')
      }}
      style={styles.button}
    >
      <Text style={{ color: 'white' }}>Accedi</Text>
    </TouchableOpacity>
  )
}

const LogoutButton = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        logout(props.update)
      }}
      style={styles.button}
    >
      <Text style={styles.text}>Disconnettiti</Text>
    </TouchableOpacity>
  )
}

const LogButton = (props) => {
  if (props.flag) {
    return <LogoutButton update={props.update} />
  } else {
    return <LoginButton />
  }
}

const logout = async (setForceUpdate) => {
  const storageJSON = await AsyncStorage.getItem('storage')
  const storageData = JSON.parse(storageJSON)
  const token = storageData.token

  fetch(`${API}/logout`, {
    method: 'Delete',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw error
        })
      }
      return response.json()
    })
    .then(() => {
      AsyncStorage.removeItem('storage')
        .then(() => {
          setForceUpdate(value => !value)
          Alert.alert('Logout effettuato')
        })
        .catch(error => {
          console.error('Errore durante la cancellazione del token:', error)
        })
    })
    .catch(error => {
      Alert.alert('Errore', error.error)
    })
}

export default function App() {
  const [checkLog, setCheckLog] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)

  useEffect(() => {
    const getToken = async () => {
      const storageJSON = await AsyncStorage.getItem('storage')
      if (storageJSON) {
        setCheckLog(true)
      } else {
        setCheckLog(false)
      }
    }
    getToken()
  }, [forceUpdate])

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#008000', // Colore di sfondo dell'header
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
            title: 'Home',
            headerRight: () => <LogButton flag={checkLog} update={setForceUpdate} />,
            // headerRightContainerStyle: { marginRight: 15 },
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
          initialParams={{ setForceUpdate }}
          options={{
            title: 'Accedi',
          }}
        />
        <Stack.Screen
          name="Sing-in"
          component={Singin}
          initialParams={{ setForceUpdate }}
          options={{
            title: 'Registrati',
          }}
        />
        <Stack.Screen
          name="My list"
          component={MyList}
          options={{
            title: 'Le mie liste',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          initialParams={{ setForceUpdate }}
          options={{
            title: 'Impostazioni Account',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}