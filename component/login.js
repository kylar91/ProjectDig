import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

function Login({ navigation }) {
    const [inputEmail, setInputEmail] = useState('');
    const [inputPass, setInputPass] = useState('');

    const handleInputChangeEmail = (text) => {
        setInputEmail(text);
    };

    const handleInputChangePass = (text) => {
        setInputPass(text);
    };

    const handleLogin = () => {
        // Esempio di azione di accesso con i dati inseriti
        console.log('Email:', inputEmail);
        console.log('Password:', inputPass);

        // Qui puoi aggiungere la logica di accesso reale, ad esempio, inviando i dati al tuo server
        // e gestendo la risposta del server.
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accedi</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"
                onChangeText={handleInputChangeEmail}
                value={inputEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                onChangeText={handleInputChangePass}
                value={inputPass}
            />

            <Button
                title="Accedi"
                color="#008000" // Verde
                onPress={handleLogin}
            />
            <Button
                onPress={() => {
                    navigation.navigate('Sing-in')
                }}
                title='Registrati'
                color="#008000" // Verde
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // Nero
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff', // Testo bianco
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        width: 250,
        color: '#fff', // Testo bianco
    },
});

export default Login;