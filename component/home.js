import { API } from '../Config'
import { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function Home() {
    const [listAnime, setListAnime] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredAnime, setFilteredAnime] = useState([])
    const [isModalVisible, setModalVisible] = useState(false)
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
            toggleModal()
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

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerFlat}>
                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.footerButtonText}>funzionalità disponibile solo per utenti registrati</Text>
                    </View>
                </Modal>
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

export default Home