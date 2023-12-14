import { API } from '../Config'
import { useState } from 'react'
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '.././css.js'

function Login({ navigation, route }) {
    const { setForceUpdate } = route.params
    const [inputUsername, setInputUsername] = useState('')
    const [inputPass, setInputPass] = useState('')

    const handleInputChangeEmail = (text) => {
        setInputUsername(text)
    }

    const handleInputChangePass = (text) => {
        setInputPass(text)
    }

    const handleLogin = () => {

        fetch(`${API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: inputUsername,
                password: inputPass
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw error
                    })
                }
                return response.json()
            })
            .then(data => {
                const storage = {
                    token: data.token,
                    user: data.username
                }
                const storageJSON = JSON.stringify(storage)
                return AsyncStorage.setItem('storage', storageJSON)
            })
            .then(() => {
                setForceUpdate(value => !value)
                navigation.navigate('Home')
            })
            .catch(error => {
                Alert.alert('Errore', error.error)
            })
    }

    return (
        <View style={styles.containerIn}>
            <Text style={styles.titleIn}>Accedi</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#fff"
                onChangeText={handleInputChangeEmail}
                value={inputUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                onChangeText={handleInputChangePass}
                value={inputPass}
            />

            <Button
                title="Accedi"
                color="#008000" // Verde
                onPress={handleLogin}
            />
            <Text style={styles.textLogin}>Non hai un account?</Text>
            <Button
                onPress={() => {
                    navigation.navigate('Sing-in')
                }}
                title='Registrati'
                color="#008000" // Verde
            />
        </View>
    )
}

export default Login