import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TrackingScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Tracking</Text>
      </View>
      
      <View style={styles.trackingIdCard}>
        <Text style={styles.cargoId}>Cargo ID: CRG-1845</Text>
      </View>

      <View style={styles.routeCard}>
        <Text style={styles.routeTitle}>Route Information</Text>
        <View style={styles.routePoints}>
          <View style={styles.routePoint}>
            <View style={[styles.dot, styles.originDot]} />
            <View style={styles.routeLine} />
          </View>
          <View style={styles.routePoint}>
            <View style={styles.routeLine} />
            <View style={[styles.dot, styles.destinationDot]} />
          </View>
        </View>
        <View style={styles.locations}>
          <Text style={styles.locationText}>Origin: New York, NY</Text>
          <Text style={styles.locationText}>Destination: Miami, FL</Text>
        </View>
      </View>

      <View style={styles.shipmentCard}>
        <View style={styles.shipmentHeader}>
          <Text style={styles.shipmentId}>CRG-1845</Text>
          <View style={styles.transitBadge}>
            <Text style={styles.transitText}>In Transit</Text>
          </View>
        </View>
        <Text style={styles.shipmentType}>Electronics Shipment</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={22} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Driver Name</Text>
            <Text style={styles.infoValue}>Michael Roberts</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={22} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Current Location</Text>
            <Text style={styles.infoValue}>Interstate 95, Baltimore, MD</Text>
            <Text style={styles.updateTime}>Last updated: 5 minutes ago</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={22} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Estimated Time of Arrival</Text>
            <Text style={styles.etaValue}>2h 45m</Text>
            <Text style={styles.expectedTime}>Expected: Today, 4:30 PM</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="navigate-outline" size={22} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Distance Remaining</Text>
            <Text style={styles.infoValue}>142 miles</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 50, paddingBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  trackingIdCard: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 15, marginTop: -20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cargoId: { fontSize: 16, fontWeight: '600', color: '#333' },
  routeCard: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 15, marginTop: 15, padding: 15 },
  routeTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  routePoints: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routePoint: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  originDot: { backgroundColor: '#34C759' },
  destinationDot: { backgroundColor: '#FF3B30' },
  routeLine: { flex: 1, height: 2, backgroundColor: '#007AFF', marginHorizontal: 5 },
  locations: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  locationText: { fontSize: 12, color: '#666' },
  shipmentCard: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 15, marginTop: 15, marginBottom: 30, padding: 15 },
  shipmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  shipmentId: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  transitBadge: { backgroundColor: '#007AFF20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  transitText: { color: '#007AFF', fontWeight: '600' },
  shipmentType: { fontSize: 14, color: '#666', marginBottom: 20 },
  infoRow: { flexDirection: 'row', gap: 15, marginBottom: 20 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  infoValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  updateTime: { fontSize: 11, color: '#999', marginTop: 2 },
  etaValue: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginVertical: 2 },
  expectedTime: { fontSize: 12, color: '#666' },
});