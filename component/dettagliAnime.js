import { API } from '../Config'
import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import CommentSection from './commentSection'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function AnimeDetails({ route }) {
    const [animeInfo, setAnimeInfo] = useState([])
    const { animeId, setRerenderMyList } = route.params
    const nameList = ["in_corso", "completati", "droppati"]
    const [addedToListMessage, setAddedToListMessage] = useState(null)
    const [isModalVisible, setModalVisible] = useState(false)

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
                    if (setRerenderMyList) {
                        setRerenderMyList(value => !value)
                    }
                    // da sistemare la scritta in corso
                    setAddedToListMessage(`Anime aggiunto a "${nameListIndex.replace('_', ' ')}" con successo!`)
                    setTimeout(() => {
                        setAddedToListMessage(null)
                    }, 3000)
                })
                .catch(error => {
                    Alert.alert('Error', error.error)
                })
        } else {
            toggleModal()
        }
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
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

                        {/* Sezione Commenti */}
                        <CommentSection animeId={animeId} />
                    </View>
                )}
                nestedScrollEnabled={true}
                style={{ marginBottom: 64, width: '100%' }} // Aggiunto margine inferiore
            />

            {/* Footer Fisso */}
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
        </View>
    )
}

export default AnimeDetails