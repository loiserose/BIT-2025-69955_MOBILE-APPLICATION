import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addStudent } from './database';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('');

  const saveStudent = async () => {
    console.log('🔵 Save button pressed');
    
    if (!name.trim() || !email.trim() || !phone.trim() || !course.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    console.log('📝 Attempting to save:', name);
    
    const result = await addStudent(name.trim(), email.trim(), phone.trim(), course.trim());
    
    console.log('📊 Result:', result);
    
    if (result.success) {
      Alert.alert('Success', `${name} has been registered!`, [
        { text: 'OK', onPress: () => router.back() }
      ]);
      setName('');
      setEmail('');
      setPhone('');
      setCourse('');
    } else {
      Alert.alert('Error', 'Failed to save student: ' + (result.error || 'Unknown error'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="student@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <Text style={styles.label}>Course</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Computer Science"
        value={course}
        onChangeText={setCourse}
      />
      
      <TouchableOpacity style={styles.saveButton} onPress={saveStudent}>
        <Text style={styles.saveButtonText}>Save Student</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#8E8E93',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});