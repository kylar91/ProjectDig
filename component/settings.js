import { API } from '../Config'
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal';

function Settings({ route }) {
    const { setForceUpdate } = route.params
    const [user, setUser] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false)
    const [rerenderSettings, setRerenderSettings] = useState(false)
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
    }, [rerenderSettings]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        if (textDelete) {
            setTextDelete(!textDelete)
        }
        setPasswordInput('')
        setTextInput('')
    };

    const handleModalSubmit = async () => {
        const storageJSON = await AsyncStorage.getItem('storage')
        const storageData = JSON.parse(storageJSON)
        const token = storageData.token

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
                        throw error;
                    });
                }
                return response.json();
            })
            .then(() => {
                if (field == 'username') {
                    const storage = {
                        token: token,
                        user: textInput
                    }
                    const storageJSON = JSON.stringify(storage)
                    AsyncStorage.setItem('storage', storageJSON)
                }
                setRerenderSettings(!rerenderSettings)
            })
            .catch(error => {
                Alert.alert('Error', error.error);
            });
        toggleModal();
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
        toggleModal();
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
                        throw error;
                    });
                }
                return response.json();
            })
            .then(() => {
                AsyncStorage.clear()
                setForceUpdate(value => !value)
                navigation.navigate('Home')
            })
            .catch(error => {
                Alert.alert('Error', error.error);
            });
        toggleModal();
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Caricamento...</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Finestra modale */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={[styles.modalContainer, field === 'password' ? { height: 220 } : { height: 150 }]}>
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
                        <Text style={styles.commentButtonText}>{textDelete ? 'Elimina account' : `Cambia ${field}`}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Text style={styles.title}>Gestione Account</Text>
            <Text style={styles.text}>Username: {user.username}</Text>
            <Text style={styles.text}>Email: {user.email}</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}
                    onPress={() => changeCredentials('username')} >Cambia Username</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => changeCredentials('email')} >
                <Text style={styles.buttonText}>Cambia Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
                onPress={() => changeCredentials('password')} >
                <Text style={styles.buttonText}>Cambia Password</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}
                onPress={() => delAccountSafe()}>
                <Text style={styles.buttonText}>Elimina Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        fontSize: 22,
        color: '#fff',
        marginBottom: 50,
        marginTop: 50,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 30,
    },
    textDel: {
        fontSize: 15,
        color: '#fff',
    },
    button: {
        backgroundColor: '#008000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 40,
    },
    deleteButton: {
        backgroundColor: '#ff0000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        backgroundColor: '#2E2E2E',
        padding: 16,
        borderRadius: 8,
        width: '90%',
        alignSelf: 'center',
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 8,
        color: '#fff',
        fontSize: 16,
    },
    commentButton: {
        backgroundColor: '#008000',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        margin: 8,
        alignItems: 'center',
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Settings;