import { API } from './Config'
import React, { useEffect, useState } from 'react'
import { Button, Alert } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Home from './component/home.js'
import AnimeDetails from './component/dettagliAnime.js'
import Login from './component/login.js'
import Singin from './component/singin.js'
import MyList from './component/mylist.js'
import styles from './css.js'

const Stack = createStackNavigator()

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

const LogoutButton = (props) => {
  return (
    <Button
      onPress={() => {
        logout(props.update)
      }}
      title='Disconnettiti'
      color="black"
    />
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
          decreaseForceUpdate(setForceUpdate)
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

const decreaseForceUpdate = (setForceUpdate) => {
  setForceUpdate(prevValue => prevValue - 1)
}

export default function App() {
  const [checkLog, setCheckLog] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)

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
            title: 'La mia Home',
            headerRight: () => <LogButton flag={checkLog} update={setForceUpdate}
            />,
            headerRightContainerStyle: { marginRight: 15 },
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}