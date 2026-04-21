import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import "./global.css";
import ConnectScreen from './src/screens/ConnectScreen';

export default function App() {
  return (
    <View className="flex-1 bg-white">
      <ConnectScreen />
      <StatusBar style="auto" />
    </View>
  );
}
