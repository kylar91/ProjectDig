import { API } from '../Config'
import { useState, useEffect } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import styles from '.././css.js'

function CommentSection({ animeId }) {
    const [newComment, setNewComment] = useState('')
    const [editComment, setEditComment] = useState('')
    const [idComment, setIdComment] = useState('')
    const [comments, setComments] = useState([])
    const [forceRerender, setForceRerender] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')

    useEffect(() => {
        fetchComments()
    }, [animeId, forceRerender])

    const fetchComments = async () => {
        const storageJSON = await AsyncStorage.getItem('storage')
        if (storageJSON) {
            const storageData = JSON.parse(storageJSON)
            setUser(storageData.user)
            setToken(storageData.token)
        }
        fetch(`${API}/comments/${animeId}`)
            .then(response => response.json())
            .then(data => {
                setComments(data)
            })
            .catch(error => console.error('Errore nella richiesta di rete:', error))
    }

    const handleCommentSubmit = async () => {
        // Invia il commento al server
        if (token) {
            fetch(`${API}/comments/${animeId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    user: user,
                    comment: newComment
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
                    setForceRerender(!forceRerender)
                })
                .catch(error => {
                    Alert.alert('Error', error.error)
                })
        } else {
            toggleModal()
        }
        setNewComment('')
    }

    const renderCommentItem = ({ item }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <Text style={[styles.commentUsername, item.username == 'Utente Rimosso' ? { textDecorationLine: 'line-through' } : {}]}>{item.username}</Text>
                <Text style={styles.commentDate}>{item.data}</Text>
            </View>
            <Text style={styles.commentDate}>{item.comment}</Text>
            {user && item.username === user && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => handleDeleteComment(item._id)}>
                        <Text style={styles.deleteButton}>Elimina</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEditComment(item._id)}>
                        <Text style={styles.editButton}>Modifica</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )

    const handleDeleteComment = (commentId) => {
        fetch(`${API}/comments/${animeId}/comment`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentId: commentId,
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
                setForceRerender(!forceRerender)
            })
            .catch(error => {
                Alert.alert('Error', error.error)
            })
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible)
    }

    const handleEditComment = (commentId) => {
        setIdComment(commentId)
        toggleModal()

    }

    const handleModalSubmit = () => {
        fetch(`${API}/comments/${animeId}/comment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentId: idComment,
                newText: editComment,
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
                setForceRerender(!forceRerender)
            })
            .catch(error => {
                Alert.alert('Error', error.error)
            })
        toggleModal()
    }

    return (
        <View style={styles.containerComment}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Aggiungi un commento..."
                    placeholderTextColor="#fff"
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
                    <Text style={styles.footerButtonText}>Invia</Text>
                </TouchableOpacity>
            </View>
            {/* Finestra modale */}
            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                {token ? (
                    <View style={styles.modalContainer}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Modifica il commento..."
                            placeholderTextColor="#fff"
                            multiline
                            numberOfLines={4}
                            value={editComment}
                            onChangeText={(text) => setEditComment(text)}
                        />
                        <TouchableOpacity style={styles.commentButton} onPress={handleModalSubmit}>
                            <Text style={styles.footerButtonText}>Invia</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.modalContainer}>
                        <Text style={styles.commentButtonTextModal}>funzionalità disponibile solo per utenti registrati</Text>
                    </View>
                )}

            </Modal>
            {comments !== null && (
                <FlatList
                    data={comments.comments}
                    renderItem={renderCommentItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ width: '100%', flex: 1 }}
                />
            )}
        </View>
    )
}

export default CommentSection