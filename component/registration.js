import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

function Registration({ navigation }) {
    const [inputUsername, setInputUsername] = useState('')
    const [inputEmail, setInputEmail] = useState("")
    const [inputPass, setInputPass] = useState("")

    const handleInputChangeUsername = (text) => {
        setInputUsername(text);
    }

    const handleInputChangeEmail = (text) => {
        setInputEmail(text)
    }

    const handleInputChangePass = (text) => {
        setInputPass(text)
    }

    const handleRegistration = () => {
        // Esempio di azione di registrazione con i dati inseriti
        console.log('Nome utente:', inputUsername);
        console.log('Email:', inputEmail);
        console.log('Password:', inputPass);

        // Qui puoi aggiungere la logica di registrazione reale, ad esempio, inviando i dati al tuo server
        // e gestendo la risposta del server.
    }



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrazione</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome utente"
                onChangeText={handleInputChangeUsername}
                value={inputUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleInputChangeEmail}
                value={inputEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={handleInputChangePass}
                value={inputPass}
            />

            <Button
                title="Registrati"
                color="black"
                onPress={handleRegistration}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
    },
});

export default Registration;