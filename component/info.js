import { View, Text, Button } from 'react-native';

function Info({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Info</Text>
            <Button
                title="Vai a Dettagli"
                onPress={() => navigation.navigate('Settings')}
            />
        </View>
    );
}

export default Info;