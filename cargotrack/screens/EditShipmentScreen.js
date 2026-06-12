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
import { updateShipment } from '../services/database';

export default function EditShipmentScreen({ navigation, route }) {
  const { shipment } = route.params;
  
  const [trackingNumber, setTrackingNumber] = useState(shipment.trackingNumber);
  const [senderName, setSenderName] = useState(shipment.senderName);
  const [receiverName, setReceiverName] = useState(shipment.receiverName);
  const [origin, setOrigin] = useState(shipment.origin);
  const [destination, setDestination] = useState(shipment.destination);
  const [status, setStatus] = useState(shipment.status);
  const [weight, setWeight] = useState(shipment.weight ? String(shipment.weight) : '');
  const [description, setDescription] = useState(shipment.description || '');

  const statusOptions = ['Pending', 'In Transit', 'Delivered', 'Delayed'];

  const handleUpdateShipment = async () => {
    if (!trackingNumber || !senderName || !receiverName || !origin || !destination) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const result = await updateShipment(shipment.id, {
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
      Alert.alert('Success', 'Shipment updated successfully!', [
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
          <Text style={styles.title}>Edit Shipment</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tracking Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., CRT-2024-001"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            editable={false}
            editable={false}
          />
          <Text style={styles.readonlyNote}>Tracking number cannot be edited</Text>

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

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateShipment}>
            <Text style={styles.updateButtonText}>Update Shipment</Text>
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
  readonlyNote: { fontSize: 12, color: '#999', marginBottom: 12 },
  statusContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  statusOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 8, marginBottom: 8 },
  statusOptionActive: { backgroundColor: '#007AFF' },
  statusText: { color: '#333' },
  statusTextActive: { color: '#fff' },
  updateButton: { backgroundColor: '#FF9800', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  updateButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});