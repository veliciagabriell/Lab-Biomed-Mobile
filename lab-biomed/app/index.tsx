import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Home() {
  useEffect(() => {
    fetch('http://localhost:3000/health')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View>
      <Text>Check console log</Text>
    </View>
  );
}
