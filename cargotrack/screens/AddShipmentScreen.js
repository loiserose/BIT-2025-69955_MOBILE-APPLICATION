import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { addShipment } from '../services/database';

export default function AddShipmentScreen({ navigation }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState('Pending');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');

  const statusOptions = ['Pending', 'In Transit', 'Delivered', 'Delayed'];

  const handleAddShipment = async () => {
    if (!trackingNumber || !senderName || !receiverName || !origin || !destination) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const result = await addShipment({
      trackingNumber,
      senderName,
      receiverName,
      origin,
      destination,
      status,
      weight: weight ? parseFloat(weight) : null,
      description,
      estimatedDelivery: null
    });

    if (result.success) {
      Alert.alert('Success', 'Shipment added successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Shipment</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tracking Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., CRT-2024-001"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
          />

          <Text style={styles.label}>Sender Name *</Text>
          <TextInput style={styles.input} placeholder="Sender name" value={senderName} onChangeText={setSenderName} />

          <Text style={styles.label}>Receiver Name *</Text>
          <TextInput style={styles.input} placeholder="Receiver name" value={receiverName} onChangeText={setReceiverName} />

          <Text style={styles.label}>Origin *</Text>
          <TextInput style={styles.input} placeholder="City, Country" value={origin} onChangeText={setOrigin} />

          <Text style={styles.label}>Destination *</Text>
          <TextInput style={styles.input} placeholder="City, Country" value={destination} onChangeText={setDestination} />

          <Text style={styles.label}>Status</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.statusOption, status === opt && styles.statusOptionActive]}
                onPress={() => setStatus(opt)}
              >
                <Text style={[styles.statusText, status === opt && styles.statusTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} placeholder="Optional" value={weight} onChangeText={setWeight} keyboardType="numeric" />

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Optional" value={description} onChangeText={setDescription} multiline numberOfLines={3} />

          <TouchableOpacity style={styles.addButton} onPress={handleAddShipment}>
            <Text style={styles.addButtonText}>Add Shipment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 8 },
  textArea: { height: 80, textAlignVertical: 'top' },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  statusOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 8, marginBottom: 8 },
  statusOptionActive: { backgroundColor: '#007AFF' },
  statusText: { color: '#333' },
  statusTextActive: { color: '#fff' },
  addButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});