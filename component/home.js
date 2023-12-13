import { API } from '../Config'
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home() {
    const [listAnime, setListAnime] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredAnime, setFilteredAnime] = useState([])
    const navigation = useNavigation()

    useEffect(() => {
        fetch(`${API}/anime`)
            .then(response => response.json())
            .then(data => {
                setListAnime(data)
                setFilteredAnime(data)
            })
            .catch(error => console.error('Errore nella richiesta di rete:', error))
    }, [])

    const handleAnimePress = (animeId) => {
        if (animeId) {
            navigation.navigate('Dettagli Anime', { animeId })
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query)
        const filtered = listAnime.filter(anime =>
            anime.anime.toLowerCase().includes(query.toLowerCase())
        )
        setFilteredAnime(filtered)
    }

    const buttonsFooter = async (str) => {
        const storageJSON = await AsyncStorage.getItem('storage')
        if (storageJSON) {
            navigation.navigate(`${str}`)
        } else {
            //todo
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleAnimePress(item._id)}>
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.img }} style={styles.image} />
                <Text style={styles.title}>{item.anime}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <View style={styles.containerFlat}>
                <Text style={styles.headerText}>Anime</Text>

                {/* Barra di Ricerca */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cerca per nome..."
                    placeholderTextColor="#fff"
                    onChangeText={handleSearch}
                    value={searchQuery}
                />

                <FlatList
                    data={filteredAnime}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            </View>


            {/* Footer Fisso */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton}
                    onPress={() => buttonsFooter('My list')}>
                    <Text style={styles.footerButtonText}>Le mie liste</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton}
                    onPress={() => buttonsFooter('Settings')}>
                    <Text style={styles.footerButtonText}>impostazioni</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Colore di sfondo nero
    },
    containerFlat: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
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
})

export default Home