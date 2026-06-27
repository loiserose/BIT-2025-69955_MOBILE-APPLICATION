import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  PanResponder,
  Animated
} from 'react-native';
import EventHandler from '../utils/EventHandler';

const EventDemoComponent = () => {
  const [inputText, setInputText] = useState('');
  const [logs, setLogs] = useState([]);
  const [pan] = useState(new Animated.Value(0));
  const handler = new EventHandler();

  // Add log to display
  const addLog = (message) => {
    setLogs(prev => [message, ...prev.slice(0, 9)]);
  };

  // Handle text input
  const handleTextChange = (text) => {
    setInputText(text);
    addLog(`✏️ Typing: "${text}"`);
  };

  // Handle submit button
  const handleSubmit = () => {
    const result = handler.onKeyPress('Enter');
    addLog(`📤 ${result.message}`);
    if (inputText) {
      Alert.alert('Input Submitted', `You typed: ${inputText}`);
    }
  };

  // Handle tap
  const handleTap = () => {
    const result = handler.onTap();
    addLog(`👆 ${result.message}`);
  };

  // Handle long press
  const handleLongPress = () => {
    const result = handler.onLongPress();
    addLog(`⏱️ ${result.message}`);
    Alert.alert('Context Menu', 'Long press detected!');
  };

  // Validate input
  const validateInput = () => {
    const result = handler.validateInput(inputText, 'email');
    addLog(`✅ Validation: ${result.message}`);
    Alert.alert('Validation Result', result.message);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    addLog('🗑️ Logs cleared');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📱 User Input & Events Demo</Text>
      <Text style={styles.subtitle}>Week 8: Class-Based Event Handling</Text>

      {/* Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⌨️ Keyboard Input</Text>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          value={inputText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmit}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.submitBtn]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.validateBtn]} onPress={validateInput}>
            <Text style={styles.buttonText}>Validate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Touch Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👆 Touch Events</Text>
        <View style={styles.touchArea}>
          <TouchableOpacity style={styles.tapButton} onPress={handleTap}>
            <Text style={styles.tapText}>TAP ME</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.longPressButton} 
            onLongPress={handleLongPress}
            delayLongPress={500}>
            <Text style={styles.tapText}>LONG PRESS ME</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logs Section */}
      <View style={styles.section}>
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>📝 Event Log</Text>
          <TouchableOpacity onPress={clearLogs}>
            <Text style={styles.clearBtn}>Clear</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logContainer}>
          {logs.length === 0 ? (
            <Text style={styles.logEmpty}>No events logged yet</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logItem}>{log}</Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
  },
  validateBtn: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  touchArea: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  tapButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  longPressButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  tapText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearBtn: {
    color: '#F44336',
    fontWeight: '600',
  },
  logContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
  },
  logEmpty: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  logItem: {
    fontSize: 13,
    color: '#333',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default EventDemoComponent;