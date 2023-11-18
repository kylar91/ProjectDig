import { View, Text, Button } from 'react-native';

function Settings({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings</Text>
            <Button
                title="Vai a Dettagli"
                onPress={() => navigation.navigate('Details')}
            />
        </View>
    );
}

export default Settings;