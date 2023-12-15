import { API } from '../Config'
import { View, Text, Button, TextInput } from 'react-native'
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function Singin({ navigation, route }) {
    const { setForceUpdate } = route.params
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPass, setInputPass] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)
    const [textModalError, setTextModalError] = useState('')

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
        if (!inputEmail || !inputUsername || !inputPass) {
            setTextModalError('Tutti i campi devono essere riempiti')
            toggleModal()
            return
        }
        const emailRegex = /^\S+@\S+\.\S+$/
        const userRegex = /^\S+$/
        if (userRegex.test(inputUsername) && emailRegex.test(inputEmail)) {
            fetch(`${API}/singin`, {
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
                .then(() => {
                    return fetch(`${API}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: inputUsername,
                            password: inputPass
                        })
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
                    setTextModalError(error.error)
                    toggleModal()
                })
        } else {
            if (userRegex.test(inputUsername)) {
                setTextModalError('Email non valida')
            } else {
                setTextModalError('Il nome utente non può contenere spazi')
            }
            toggleModal()
        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    return (
        <View style={styles.containerIn}>

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContainer}>
                    <Text style={styles.titleError}>Errore</Text>
                    <Text style={styles.textError}>{textModalError}</Text>
                </View>
            </Modal>

            <Text style={styles.titleIn}>Registrazione</Text>

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

export default Singin