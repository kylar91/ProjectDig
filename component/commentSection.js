import { API } from '../Config';
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CommentSection({ animeId }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [forceRerender, setForceRerender] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [animeId, forceRerender]);

    const fetchComments = () => {
        fetch(`${API}/comments/${animeId}`)
            .then(response => response.json())
            .then(data => {
                setComments(data);
            })
            .catch(error => console.error('Errore nella richiesta di rete:', error));
    };

    const handleCommentSubmit = async () => {
        // Invia il commento al server
        const token = await AsyncStorage.getItem('token');
        if (token) {
            fetch(`${API}/comments/${animeId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    comment: newComment
                })
            })
                .then(response => {
                    if (!response.ok) {
                        console.log('!no')
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
        </View>
    );

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
});

export default CommentSection;