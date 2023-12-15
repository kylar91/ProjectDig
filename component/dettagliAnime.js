import { API } from '../Config'
import { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native'
import CommentSection from './commentSection'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function AnimeDetails({ route }) {
    const { animeId, setRerenderMyList } = route.params
    const [animeInfo, setAnimeInfo] = useState([])
    const [addedToListMessage, setAddedToListMessage] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false)
    const [addedAnimeToListButton, setAddedAnimeToListButton] = useState(false)
    const nameList = ["in_corso", "completati", "droppati"]

    useEffect(() => {
        fetch(`${API}/anime/${animeId}`)
            .then(response => response.json())
            .then(data => setAnimeInfo(data))
            .catch(error => console.error('Errore nella richiesta di rete:', error))
    }, [animeId])

    const addOnList = async (nameListIndex) => {
        const storageJSON = await AsyncStorage.getItem('storage')
        if (storageJSON) {
            const storageData = JSON.parse(storageJSON)
            const token = storageData.token
            fetch(`${API}/myLists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    animeId: animeId,
                    token: token,
                    nameList: nameListIndex
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
                    setAddedAnimeToListButton(!addedAnimeToListButton)
                    if (setRerenderMyList) {
                        setRerenderMyList(value => !value)
                    }
                    setAddedToListMessage(`Anime aggiunto a "${nameListIndex.replace('_', ' ')}" con successo!`)
                    setTimeout(() => {
                        setAddedToListMessage(null)
                    }, 3000)
                })
                .catch(error => {
                    Alert.alert('Error', error.error)
                })
        } else {
            if (addedAnimeToListButton) {
                setAddedAnimeToListButton(false)
            }
            toggleModal()
        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const MonoFooterButton = () => {
        setAddedAnimeToListButton(!addedAnimeToListButton)
    }

    return (
        <View style={styles.container}>
            {addedToListMessage && (
                <View style={styles.successMessage}>
                    <Text style={styles.successMessageText}>{addedToListMessage.replace('_', ' ')}</Text>
                </View>
            )}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={styles.modalContainer}>
                    <Text style={styles.commentButtonTextModal}>funzionalità disponibile solo per utenti registrati</Text>
                </View>
            </Modal>
            <FlatList
                data={[animeInfo]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.contentContainer}>
                        <Image source={{ uri: item.img }} style={styles.imageDetails} />
                        <Text style={styles.titleDetails}>{item.anime}</Text>
                        <Text style={styles.infoText}>Data: {item.data}</Text>
                        <Text style={styles.infoText}>Episodi: {item.episodi}</Text>
                        <Text style={styles.infoText}>Stato: {item.stato}</Text>
                        <Text style={styles.infoText}>{item.info}</Text>

                        <CommentSection animeId={animeId} />
                    </View>
                )}
                nestedScrollEnabled={true}
                style={{ marginBottom: 64, width: '100%' }}
            />

            {addedAnimeToListButton ? (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton} onPress={() => addOnList(nameList[0])}>
                        <Text style={styles.footerButtonText}>In corso</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => addOnList(nameList[1])}>
                        <Text style={styles.footerButtonText}>Completato</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton} onPress={() => addOnList(nameList[2])}>
                        <Text style={styles.footerButtonText}>Droppato</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}
                        onPress={() => MonoFooterButton()}>
                        <Text style={styles.footerButtonText}>Aggiungi anime ad una lista</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    )
}

export default AnimeDetails