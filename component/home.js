import { View, Text, Button } from 'react-native';

function Home({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
            <Button
                title="Vai a Dettagli"
                onPress={() => navigation.navigate('Info')}
            />
        </View>
    );
}

export default Home;