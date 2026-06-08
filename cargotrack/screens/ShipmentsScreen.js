import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ShipmentsScreen() {
  const shipments = [
    { id: 'CRG-1845', origin: 'New York, NY', destination: 'Miami, FL', status: 'In Transit', eta: '2h 45m', statusColor: '#007AFF' },
    { id: 'CRG-1842', origin: 'Los Angeles, CA', destination: 'Seattle, WA', status: 'Delivered', eta: 'Delivered', statusColor: '#34C759' },
    { id: 'CRG-1844', origin: 'Chicago, IL', destination: 'Dallas, TX', status: 'Delayed', eta: 'Delayed', statusColor: '#FF3B30' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by ID, origin, or destination..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.filterTabs}>
        <TouchableOpacity style={[styles.filterTab, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>All (38)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>In Transit (24)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Delivered (12)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Delayed (2)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {shipments.map((shipment, index) => (
          <TouchableOpacity key={index} style={styles.shipmentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.shipmentId}>{shipment.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${shipment.statusColor}20` }]}>
                <Text style={[styles.statusText, { color: shipment.statusColor }]}>{shipment.status}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Origin: {shipment.origin}</Text>
              <Ionicons name="arrow-forward" size={14} color="#999" />
              <Text style={styles.locationLabel}>Destination: {shipment.destination}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.etaText}>ETA: {shipment.eta}</Text>
              <Text style={styles.viewDetails}>View Details →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc', padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, borderWidth: 1, borderColor: '#e0e0e0' },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 16 },
  filterTabs: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff' },
  activeFilter: { backgroundColor: '#007AFF' },
  filterText: { color: '#666' },
  activeFilterText: { color: '#fff', fontWeight: '600' },
  shipmentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  shipmentId: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  locationLabel: { fontSize: 13, color: '#666' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  etaText: { fontSize: 14, color: '#666' },
  viewDetails: { color: '#007AFF', fontWeight: '600' },
});