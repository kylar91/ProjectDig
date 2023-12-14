import { API } from '../Config'
import { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styles from '.././css.js'

function MyList({ navigation }) {
    const [myListAnime, setMyListAnime] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredMyListAnime, setFilteredMyListAnime] = useState([])
    const [rerenderMyList, setRerenderMyList] = useState(false)
    const [list, setList] = useState('')
    const nameList = ["in_corso", "completati", "droppati"]

    const getMyLists = async () => {
        const storageJSON = await AsyncStorage.getItem('storage')
        const storageData = JSON.parse(storageJSON)
        const token = storageData.token

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

    useEffect(() => {
        getMyLists()
    }, [rerenderMyList])

    const myList = (nameListIndex) => {
        setList(nameListIndex)
    }

    const handleAnimePress = (animeId) => {
        if (animeId) {
            navigation.navigate('Dettagli Anime', { animeId, setRerenderMyList })
        }
    }

    const handleDeleteAnime = async (animeId) => {
        const storageJSON = await AsyncStorage.getItem('storage')
        const storageData = JSON.parse(storageJSON)
        const token = storageData.token
        fetch(`${API}/myLists`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                animeId: animeId,
                token: token,
                nameList: list
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
                getMyLists()
            })
            .catch(error => {
                Alert.alert('Error', error.error)
            })
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleAnimePress(item._id)}>
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.img }} style={styles.image} />
                <Text style={styles.title}>{item.anime}</Text>
                {/* Aggiungi il bottone di eliminazione */}
                <TouchableOpacity
                    style={styles.deleteButtonList}
                    onPress={() => handleDeleteAnime(item._id)}
                >
                    <Text style={styles.footerButtonText}>Elimina</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )

    const handleSearch = (query) => {
        setSearchQuery(query)
        if (myListAnime[list] && myListAnime[list].length > 0) {
            const filtered = myListAnime[list].filter(anime =>
                anime.anime.toLowerCase().includes(query.toLowerCase())
            )
            setFilteredMyListAnime({ [list]: filtered })
        } else {
            setFilteredMyListAnime({ [list]: [] })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerFlat}>
                {list ? (
                    <View>
                        <Text style={styles.headerText}>La tua lista {list.replace('_', ' ')}</Text>
                        {/* Barra di Ricerca */}
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Cerca per nome..."
                            placeholderTextColor="#fff"
                            onChangeText={handleSearch}
                            value={searchQuery}
                        />
                    </View>

                ) : (
                    <View>
                        <Text style={styles.firstTitle}>Seleziona una lista</Text>
                    </View>
                )}


                <FlatList
                    data={filteredMyListAnime[list]}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            </View>


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

export default MyList