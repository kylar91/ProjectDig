import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './component/home.js';
import Info from './component/info.js';
import Settings from './component/settings.js';
import styles from './css.js'

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ title: 'La mia Home', headerStyle: { backgroundColor: 'blue' }, headerTintColor: 'white' }} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>hello!!</Text>
//       <TextInput placeholder='scrivi..' />
//       <TouchableOpacity style={styles.button} >
//         <Text style={styles.buttonText}>Invia</Text></TouchableOpacity>
//       <StatusBar style="auto" />
//     </View>
//   );
// }