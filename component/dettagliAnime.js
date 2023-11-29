import { API } from '../Config'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native'
import CommentSection from './commentSection'
import AsyncStorage from '@react-native-async-storage/async-storage'

function AnimeDetails({ route }) {
    const [animeInfo, setAnimeInfo] = useState([])
    const [comment, setComment] = useState('')
    const { animeId } = route.params
    const nameList = ["in_corso", "completati", "droppati"]

    useEffect(() => {
        fetch(`${API}/anime/${animeId}`)
            .then(response => response.json())
            .then(data => setAnimeInfo(data))
            .catch(error => console.error('Errore nella richiesta di rete:', error))
    }, [animeId])


    const addOnList = async (nameListIndex) => {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            fetch(`${API}/mylists`, {
                method: 'POST',
                headers: {
                    'Content-TYpe': 'application/json',
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
                .catch(error => {
                    Alert.alert('Error', error.error)
                })
        } else {
            //todo
        }

    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: animeInfo.img }} style={styles.image} />
                    <Text style={styles.title}>{animeInfo.anime}</Text>
                    <Text style={styles.infoText}>Data: {animeInfo.data}</Text>
                    <Text style={styles.infoText}>Episodi: {animeInfo.episodi}</Text>
                    <Text style={styles.infoText}>Stato: {animeInfo.stato}</Text>
                    <Text style={styles.infoText}>{animeInfo.info}</Text>
                    {/* Sezione Commenti */}
                    <CommentSection />
                </View>
            </ScrollView>

            {/* Footer Fisso */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton}
                    onPress={() => addOnList(nameList[0])}>
                    <Text style={styles.footerButtonText}>In corso</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}
                    onPress={() => addOnList(nameList[1])}>
                    <Text style={styles.footerButtonText}>Completato</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}
                    onPress={() => addOnList(nameList[2])}>
                    <Text style={styles.footerButtonText}>Droppato</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#000', // Colore di sfondo nero
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        paddingBottom: 64, // Altezza del footer
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
        color: '#fff', // Testo bianco
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#fff', // Testo bianco
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#008000', // Colore verde
        padding: 16,
    },
    footerButton: {
        flex: 1,
        backgroundColor: '#000', // Colore di sfondo nero
        padding: 8,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    footerButtonText: {
        color: '#fff', // Testo bianco
        fontWeight: 'bold',
    },
})

export default AnimeDetails