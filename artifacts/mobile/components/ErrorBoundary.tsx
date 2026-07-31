import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  info: string;
}

// Wrap the app's root layout with this. If anything throws during render,
// instead of the whole app crashing silently, this shows the actual error
// message and component stack right on screen so it can be read and shared
// without needing Xcode or a Mac.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, info: "" };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ info: errorInfo.componentStack ?? "" });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.label}>Error message:</Text>
            <Text style={styles.error}>{this.state.error.message}</Text>
            <Text style={styles.label}>Stack:</Text>
            <Text style={styles.stack}>{this.state.error.stack}</Text>
            {!!this.state.info && (
              <>
                <Text style={styles.label}>Component stack:</Text>
                <Text style={styles.stack}>{this.state.info}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ error: null, info: "" })}
            >
              <Text style={styles.buttonText}>Try again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0e1a" },
  scroll: { padding: 20, paddingTop: 60 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 16 },
  label: { color: "#f5a623", fontSize: 13, fontWeight: "700", marginTop: 16, marginBottom: 4 },
  error: { color: "#ff6b6b", fontSize: 14, lineHeight: 20 },
  stack: { color: "#aaa", fontSize: 11, lineHeight: 16, fontFamily: "Courier" },
  button: {
    marginTop:
