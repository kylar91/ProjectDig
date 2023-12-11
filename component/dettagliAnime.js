import { API } from '../Config';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import CommentSection from './commentSection';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AnimeDetails({ route }) {
    const [animeInfo, setAnimeInfo] = useState([]);
    const { animeId, setRerenderMyList } = route.params;
    const nameList = ["in_corso", "completati", "droppati"];
    const [addedToListMessage, setAddedToListMessage] = useState(null);


    useEffect(() => {
        fetch(`${API}/anime/${animeId}`)
            .then(response => response.json())
            .then(data => setAnimeInfo(data))
            .catch(error => console.error('Errore nella richiesta di rete:', error));
    }, [animeId]);

    const addOnList = async (nameListIndex) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            fetch(`${API}/addMyLists`, {
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
                            throw error;
                        });
                    }
                    return response.json();
                })
                .then(() => {
                    if (setRerenderMyList) {
                        setRerenderMyList(value => !value)
                    }
                    // da sistemare la scritta in corso
                    setAddedToListMessage(`Anime aggiunto a "${nameListIndex.replace('_', ' ')}" con successo!`);
                    setTimeout(() => {
                        setAddedToListMessage(null);
                    }, 3000);
                })
                .catch(error => {
                    Alert.alert('Error', error.error);
                });
        } else {
            //todo
        }
    };

    return (
        <View style={styles.container}>
            {addedToListMessage && (
                <View style={styles.successMessage}>
                    <Text style={styles.successMessageText}>{addedToListMessage.replace('_', ' ')}</Text>
                </View>
            )}
            <FlatList
                data={[animeInfo]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.contentContainer}>
                        <Image source={{ uri: item.img }} style={styles.image} />
                        <Text style={styles.title}>{item.anime}</Text>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    image: {
        width: 200,
        height: 300,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#008000',
        padding: 16,
        borderTopWidth: 3,
        borderTopColor: '#000',
    },
    footerButton: {
        flex: 1,
        backgroundColor: '#000',
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    footerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    successMessage: {
        position: 'absolute',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        borderWidth: 5,
        borderColor: 'black',
        alignSelf: 'center',
        zIndex: 1,
    },
    successMessageText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AnimeDetails;