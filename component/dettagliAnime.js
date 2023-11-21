import { API } from '../Config';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function AnimeDetails({ route }) {
    const [animeInfo, setAnimeInfo] = useState([]);
    const { animeId } = route.params;

    useEffect(() => {
        fetch(`${API}/anime/${animeId}`)
            .then(response => response.json())
            .then(data => setAnimeInfo(data))
            .catch(error => console.error('Errore nella richiesta di rete:', error));
    }, [animeId]);

    return (
        <View style={styles.container}>
            <Image source={{ uri: animeInfo.img }} style={styles.image} />
            <Text style={styles.title}>{animeInfo.anime}</Text>
            <Text style={styles.infoText}>Data: {animeInfo.data}</Text>
            <Text style={styles.infoText}>Episodi: {animeInfo.episodi}</Text>
            <Text style={styles.infoText}>Stato: {animeInfo.stato}</Text>
            <Text style={styles.infoText}>{animeInfo.info}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
    },
});

export default AnimeDetails;