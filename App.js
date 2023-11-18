import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import style from './css.js'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>hello!!</Text>
      <TextInput placeholder='scrivi..' />
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Invia</Text></TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
});
