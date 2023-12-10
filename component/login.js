import { API } from '../Config'
import { useEffect, useState } from 'react'
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

function Login({ navigation, route }) {
    const [inputUsername, setInputUsername] = useState('')
    const [inputPass, setInputPass] = useState('')
    const { setForceUpdate } = route.params

    const increaseForceUpdate = () => {
        setForceUpdate(prevValue => prevValue + 1)
    }

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
                const token = data.token
                return AsyncStorage.setItem('token', token)
            })
            .then(() => {
                increaseForceUpdate()
                navigation.navigate('Home')
            })
            .catch(error => {
                Alert.alert('Errore', error.error)
            })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accedi</Text>

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
            <Text style={styles.text}>Non hai un account?</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Nero
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Testo bianco
    },
    text: {
        fontSize: 17,
        margin: 10,
        color: '#fff', // Testo bianco
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
        color: '#fff', // Testo bianco
    },
})

export default Login