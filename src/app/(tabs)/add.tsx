import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AddTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Yeni Antrenman</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
