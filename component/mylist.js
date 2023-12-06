import { API } from '../Config'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

function MyList() {
    const [myListAnime, setMyListAnime] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredMyListAnime, setFilteredMyListAnime] = useState([])
    const nameList = ["in_corso", "completati", "droppati"]
    const [list, setList] = useState('')

    useEffect(() => {
        const getMyLists = async () => {
            const token = await AsyncStorage.getItem('token');

            fetch(`${API}/myLists`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then(response => response.json())
                .then(data => {
                    setMyListAnime(data)
                    setFilteredMyListAnime(data)
                })
                .catch(error => console.error('Errore nella richiesta di rete:', error))
        }
        getMyLists()
    }, [])

    const myList = (nameListIndex) => {
        setList(nameListIndex)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleAnimePress(item._id)}>
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.img }} style={styles.image} />
                <Text style={styles.title}>{item.anime}</Text>
            </View>
        </TouchableOpacity>
    )

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (myListAnime[list] && myListAnime[list].length > 0) {
            const filtered = myListAnime[list].filter(anime =>
                anime.anime.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMyListAnime({ [list]: filtered });
        } else {
            setFilteredMyListAnime({ [list]: [] });
        }
    }

    return (
        <View style={styles.container}>
            {list ? (
                <View>
                    <Text style={styles.title}>La tua lista {list.replace('_', ' ')}</Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.title}>Seleziona una lista</Text>
                </View>
            )}
            {/* Barra di Ricerca */}
            <TextInput
                style={styles.searchInput}
                placeholder="Cerca per nome..."
                placeholderTextColor="#fff"
                onChangeText={handleSearch}
                value={searchQuery}
            />

            <FlatList
                data={filteredMyListAnime[list]}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            {/* Footer Fisso */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={() => myList(nameList[0])}>
                    <Text style={styles.footerButtonText}>In corso</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => myList(nameList[1])}>
                    <Text style={styles.footerButtonText}>Completati</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={() => myList(nameList[2])}>
                    <Text style={styles.footerButtonText}>Droppati</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Colore di sfondo nero
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Testo bianco
    },
    searchInput: {
        height: 40,
        borderColor: '#fff', // Bordo bianco
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
        color: '#fff', // Testo bianco
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    itemContainer: {
        marginBottom: 16,
        backgroundColor: '#008000', // Colore verde
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // Testo bianco
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
    searchInput: {
        height: 40,
        borderColor: '#fff', // Bordo bianco
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
        color: '#fff', // Testo bianco
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    itemContainer: {
        marginBottom: 16,
        backgroundColor: '#008000', // Colore verde
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff', // Testo bianco
    },
})

export default MyList