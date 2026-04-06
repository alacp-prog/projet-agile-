import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import JobSearchScreen from './src/screens/JobSearchScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <JobSearchScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
