import { API } from '../Config';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';

function Registration({ navigation }) {
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPass, setInputPass] = useState('')

    const handleInputChangeUsername = (text) => {
        setInputUsername(text)
    }

    const handleInputChangeEmail = (text) => {
        setInputEmail(text)
    }

    const handleInputChangePass = (text) => {
        setInputPass(text)
    }

    const handleRegistration = () => {

        fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: inputEmail,
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
            .then(data => Alert.alert(data.message))
            .catch(error => {
                Alert.alert('Errore', error.error)
            })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrazione</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome utente"
                placeholderTextColor="#fff"
                onChangeText={handleInputChangeUsername}
                value={inputUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"
                onChangeText={handleInputChangeEmail}
                value={inputEmail}
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
                title="Registrati"
                color="#008000" // Verde
                onPress={handleRegistration}
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

export default Registration