import { API } from '../Config';
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CommentSection({ animeId }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [forceRerender, setForceRerender] = useState(false);
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')

    useEffect(() => {
        fetchComments();
    }, [animeId, forceRerender]);

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
                setComments(data);
            })
            .catch(error => console.error('Errore nella richiesta di rete:', error));
    };

    const handleCommentSubmit = async () => {
        // Invia il commento al server
        if (token) {
            fetch(`${API}/comments/${animeId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: user,
                    comment: newComment
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
                    setForceRerender(!forceRerender)
                })
                .catch(error => {
                    Alert.alert('Error', error.error);
                });
        } else {
            // TODO: Gestione caso token mancante
        }
        // Pulisce il campo del commento dopo l'invio
        setNewComment('');
    };

    const renderCommentItem = ({ item }) => (
        <View style={styles.commentItem}>
            <View style={styles.commentHeader}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentDate}>{item.data}</Text>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
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
        fetch(`${API}/comments/:id/comment/del`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                animeId: animeId,
                commentId: commentId,
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
                setForceRerender(!forceRerender)
            })
            .catch(error => {
                Alert.alert('Error', error.error);
            });
    }

    const handleEditComment = (commentId) => {
        //todo
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Aggiungi un commento..."
                    placeholderTextColor="#fff"
                    value={newComment}
                    onChangeText={(text) => setNewComment(text)}
                />
                <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
                    <Text style={styles.commentButtonText}>Invia</Text>
                </TouchableOpacity>
            </View>
            {comments !== null && (
                <FlatList
                    data={comments.comments}
                    renderItem={renderCommentItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ width: '100%', flex: 1 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: '#fff',
        borderWidth: 1,
        paddingLeft: 10,
        margin: 8,
        color: '#fff',
        fontSize: 16,
    },
    commentButton: {
        backgroundColor: '#008000',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        margin: 8,
        alignItems: 'center',
    },
    commentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    commentItem: {
        width: '100%',  // Imposta la larghezza al 100% se non lo è già
        marginVertical: 8,
        padding: 8,
        backgroundColor: '#2E2E2E',
        borderRadius: 5,
        justifyContent: 'center',
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    commentUsername: {
        fontWeight: 'bold',
        color: '#fff',
    },
    commentDate: {
        color: '#fff',
    },
    commentText: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row', // Imposta la direzione della fila
        justifyContent: 'space-between', // Distribuisce lo spazio tra i bottoni
        marginTop: 8, // Aggiunge uno spazio superiore tra il testo del commento e i bottoni
    },
    deleteButton: {
        backgroundColor: '#d10000',
        padding: 10,
        borderRadius: 5,
        marginRight: 8, // Aggiunge uno spazio tra i bottoni
        color: '#fff',
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#008000',
        padding: 10,
        borderRadius: 5,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CommentSection;