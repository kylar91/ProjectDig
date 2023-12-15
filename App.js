import { API } from './Config'
import { useState, useEffect } from 'react'
import { Alert, TouchableOpacity, Text, View } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
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
        logout(props.update, props.toggleModal)
      }}
      style={styles.button}
    >
      <Text style={styles.text}>Disconnettiti</Text>
    </TouchableOpacity>
  )
}

const LogButton = (props) => {
  if (props.flag) {
    return <LogoutButton update={props.update} toggleModal={props.toggleModal} />
  } else {
    return <LoginButton />
  }
}

const logout = async (setForceUpdate, toggleModal) => {
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
          toggleModal()
        })
        .catch(error => {
          console.error('Errore durante la cancellazione del token:', error)
        })
    })
    .catch(error => {
      Alert.alert('Errore', error.error)
    })
}

const LogoutModal = ({ isModalVisible, toggleModal }) => (
  <Modal
    isVisible={isModalVisible}
    onBackdropPress={toggleModal}
  >
    <View style={styles.modalContainer}>
      <Text style={styles.commentButtonTextModal}>Logout effettuato</Text>
    </View>
  </Modal>
)

export default function App() {
  const [checkLog, setCheckLog] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  return (
    <NavigationContainer>
      <LogoutModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#008000',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerRight: () => <LogButton flag={checkLog} update={setForceUpdate} toggleModal={toggleModal} />,
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