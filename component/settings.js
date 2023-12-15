import { API } from '../Config'
import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function Settings({ route }) {
    const { setForceUpdate } = route.params
    const [user, setUser] = useState(null)
    const [flagError, setFlagError] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)
    const [isModalVisibleTwo, setModalVisibleTwo] = useState(false)
    const [rerenderSettings, setRerenderSettings] = useState(false)
    const [textModalError, setTextModalError] = useState('')
    const [textInput, setTextInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [placeText, setPlaceText] = useState('')
    const [field, setField] = useState('')
    const [textDelete, setTextDelete] = useState(false)
    const navigation = useNavigation()

    const getUser = async () => {
        const storageJSON = await AsyncStorage.getItem('storage')
        const storageData = JSON.parse(storageJSON)
        const token = storageData.token

        fetch(`${API}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setUser(data)
            })
            .catch(error => console.error('Errore nella richiesta di rete:', error))
    }

    useEffect(() => {
        getUser()
    }, [rerenderSettings])

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
        if (textDelete) {
            setTextDelete(!textDelete)
        }
        setPasswordInput('')
        setTextInput('')
    }

    const toggleModalTwo = () => {
        setModalVisibleTwo(!isModalVisibleTwo)
    }

    const handleModalSubmit = async () => {
        const storageJSON = await AsyncStorage.getItem('storage')
        const storageData = JSON.parse(storageJSON)
        const token = storageData.token

        if (field === 'password') {
            if (!textInput || !passwordInput) {
                setFlagError(true)
                setTextModalError('Tutti i campi devono essere riempiti')
                toggleModalTwo()
                return
            }
        } else {
            if (!textInput) {
                setFlagError(true)
                setTextModalError('Tutti i campi devono essere riempiti')
                toggleModalTwo()
                return
            }
        }
        let testRegex = true
        if (field === 'email') {
            const regex = /^\S+@\S+\.\S+$/
            testRegex = regex.test(textInput)
        }
        if (field === 'username') {
            const regex = /^\S+$/
            testRegex = regex.test(textInput)
        }
        if (testRegex) {
            fetch(`${API}/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    dataField: field,
                    newData: textInput,
                    oldPass: passwordInput,
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
                    if (field == 'username') {
                        const storage = {
                            token: token,
                            user: textInput
                        }
                        const storageJSON = JSON.stringify(storage)
                        AsyncStorage.setItem('storage', storageJSON)
                    }
                    setRerenderSettings(!rerenderSettings)
                    setFlagError(false)
                    setTextModalError(data.message)
                    toggleModalTwo()
                })
                .catch(error => {
                    setFlagError(true)
                    setTextModalError(error.error)
                    toggleModalTwo()
                })
            toggleModal()
        } else {
            setFlagError(true)
            if (field === 'email') {
                setTextModalError('Email non valida')
            } else {
                setTextModalError('Il nome utente non può contenere spazi')
            }
            toggleModalTwo()
        }
    }

    const changeCredentials = (str) => {
        setField(str)
        if (str == 'username') {
            const string = 'Inserisci il nuovo ' + str
            setPlaceText(string)
        } else {
            const string = 'Inserisci la nuova ' + str
            setPlaceText(string)
        }
        toggleModal()
    }

    const delAccountSafe = () => {
        setField("")
        setTextDelete(!textDelete)
        toggleModal()
    }

    const delAccount = async () => {
        const storageJSON = await AsyncStorage.getItem('storage')
        const storageData = JSON.parse(storageJSON)
        const token = storageData.token
        if (textInput) {
            fetch(`${API}/user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password: textInput,
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
                    AsyncStorage.clear()
                    setForceUpdate(value => !value)
                    navigation.navigate('Home')
                })
                .catch(error => {
                    setFlagError(true)
                    setTextModalError(error.error)
                    toggleModalTwo()
                })
            toggleModal()
        } else {
            setFlagError(true)
            setTextModalError('Tutti i campi devono essere riempiti')
            toggleModalTwo()
        }
    }

    if (!user) {
        return (
            <View style={styles.containerSetting}>
                <Text style={styles.titleSettings}>Caricamento...</Text>
            </View>
        )
    }

    return (
        <View style={styles.containerSetting}>

            <Modal isVisible={isModalVisibleTwo} onBackdropPress={toggleModalTwo}>
                <View style={styles.modalContainer}>
                    {flagError && (
                        <Text style={styles.titleError}>Errore</Text>
                    )}
                    <Text style={[styles.textError, !flagError ? { marginTop: 45 } : null]}>{textModalError}</Text>
                </View>
            </Modal>

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={[styles.modalContainer, field === 'password' ? { height: 220 } : null]}>
                    {field === 'password' && (
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Inserisci la vecchia password"
                            placeholderTextColor="#fff"
                            secureTextEntry
                            value={passwordInput}
                            onChangeText={(text) => setPasswordInput(text)}
                        />
                    )}
                    {textDelete && <Text style={styles.textDel}>Sicuro di voler eliminare l'account?</Text>}
                    <TextInput
                        style={styles.commentInput}
                        placeholder={textDelete ? 'Inserisci la password' : placeText}
                        placeholderTextColor="#fff"
                        secureTextEntry={field === 'password' || textDelete}
                        value={textInput}
                        onChangeText={(text) => setTextInput(text)}
                    />
                    <TouchableOpacity style={[styles.commentButton, textDelete ? { backgroundColor: '#ff0000' } : { backgroundColor: '#008000' }]}
                        onPress={textDelete ? delAccount : handleModalSubmit}>
                        <Text style={styles.footerButtonText}>{textDelete ? 'Elimina account' : `Cambia ${field}`}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Text style={styles.titleSettings}>Gestione Account</Text>
            <Text style={styles.textSettings}>Username: {user.username}</Text>
            <Text style={styles.textSettings}>Email: {user.email}</Text>
            <TouchableOpacity style={styles.buttonSettings}>
                <Text style={styles.buttonText}
                    onPress={() => changeCredentials('username')} >Cambia Username</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSettings}
                onPress={() => changeCredentials('email')} >
                <Text style={styles.buttonText}>Cambia Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSettings}
                onPress={() => changeCredentials('password')} >
                <Text style={styles.buttonText}>Cambia Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButtonSettings}
                onPress={() => delAccountSafe()}>
                <Text style={styles.buttonText}>Elimina Account</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Settings