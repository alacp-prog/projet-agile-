import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import "./global.css";
import JobSearchScreen from './src/screens/JobSearchScreen';

export default function App() {
  return (
    <View className="flex-1 bg-white">
      <JobSearchScreen />
      <StatusBar style="auto" />
    </View>
  );
}
