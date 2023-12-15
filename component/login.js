import { API } from '../Config'
import { useState } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function Login({ navigation, route }) {
    const { setForceUpdate } = route.params
    const [inputUsername, setInputUsername] = useState('')
    const [inputPass, setInputPass] = useState('')
    const [isModalVisible, setModalVisible] = useState(false)
    const [textModalError, setTextModalError] = useState('')

    const handleInputChangeEmail = (text) => {
        setInputUsername(text)
    }

    const handleInputChangePass = (text) => {
        setInputPass(text)
    }

    const handleLogin = () => {
        if (!inputUsername || !inputPass) {
            setTextModalError('Tutti i campi devono essere riempiti')
            toggleModal()
            return
        }
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
                setTextModalError(error.error)
                toggleModal()
            })
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

            <Text style={styles.titleIn}>Accedi</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome utente"
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
                color="#008000"
                onPress={handleLogin}
            />
            <Text style={styles.textLogin}>Non hai un account?</Text>
            <Button
                onPress={() => {
                    navigation.navigate('Sing-in')
                }}
                title='Registrati'
                color="#008000"
            />
        </View>
    )
}

export default Login