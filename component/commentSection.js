import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native'

const CommentSection = ({ onCommentSubmit }) => {
    const [comment, setComment] = useState('')

    const handleCommentSubmit = () => {
        // Invia il commento al padre
        onCommentSubmit(comment)
        // Pulisce il campo del commento dopo l'invio
        setComment('')
    }

    return (
        <View style={styles.commentSection}>
            <TextInput
                style={styles.commentInput}
                placeholder="Aggiungi un commento..."
                value={comment}
                onChangeText={(text) => setComment(text)}
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleCommentSubmit}>
                <Text style={styles.commentButtonText}>Invia</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    commentSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 8,
        paddingLeft: 10,
    },
    commentButton: {
        backgroundColor: 'black',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    commentButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})

export default CommentSection