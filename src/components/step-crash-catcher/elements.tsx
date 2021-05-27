import React from "react";
import { SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

export const DevErrorViewer = ({ text, onPressReset }) => (
  <SafeAreaView style={styles.safeArea}>
    <StatusBar backgroundColor='red' barStyle='light-content' />
    <ScrollView contentContainerStyle={styles.scrollContainer}  >
      <Text children={text} style={styles.errorText} />
    </ScrollView>
    <Text onPress={onPressReset} children={"Reset"} style={styles.errorText} />
  </SafeAreaView>
)

export const DefaultFallBackComponent = ({ onPressIamDev, onPressReset }) => (
  <TouchableOpacity
    activeOpacity={1}
    delayLongPress={10000}
    onLongPress={onPressIamDev}
    onPress={onPressReset}
    style={{ flex: 1 }}
  />
)

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'red' },
  scrollContainer: { padding: 10 },
  errorText: { lineHeight: 24, color: 'white', fontWeight: 'bold' },
})