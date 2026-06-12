import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ShipmentDetailScreen({ navigation, route }) {
  const { shipment } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'In Transit': return '#FF9800';
      case 'Delayed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipment Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.trackingSection}>
            <Text style={styles.trackingLabel}>Tracking Number</Text>
            <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
              <Text style={styles.statusText}>{shipment.status}</Text>
            </View>
          </View>

          <View style={styles.routeSection}>
            <View style={styles.routePoint}>
              <Ionicons name="location-outline" size={20} color="#4CAF50" />
              <Text style={styles.routeLabel}>Origin</Text>
              <Text style={styles.routeValue}>{shipment.origin}</Text>
            </View>
            <Ionicons name="arrow-down-outline" size={20} color="#666" />
            <View style={styles.routePoint}>
              <Ionicons name="location-outline" size={20} color="#F44336" />
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{shipment.destination}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sender:</Text>
              <Text style={styles.infoValue}>{shipment.senderName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receiver:</Text>
              <Text style={styles.infoValue}>{shipment.receiverName}</Text>
            </View>
            {shipment.weight && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{shipment.weight} kg</Text>
              </View>
            )}
            {shipment.description && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Description:</Text>
                <Text style={styles.infoValue}>{shipment.description}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  trackingSection: { alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  trackingLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  trackingNumber: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  routeSection: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  routePoint: { alignItems: 'center' },
  routeLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  routeValue: { fontSize: 14, fontWeight: '500', color: '#333', marginTop: 2 },
  infoSection: { padding: 20 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  infoLabel: { width: 100, fontSize: 14, color: '#666' },
  infoValue: { flex: 1, fontSize: 14, color: '#333' },
});