import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchRealTimeTracking, fetchTrackingHistory } from '../services/api';

export default function TrackingScreen() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [shipment, setShipment] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Fetch tracking data
  const fetchTrackingData = async (trackNum, showLoading = true) => {
    if (showLoading) setLoading(true);
    
    const result = await fetchRealTimeTracking(trackNum);
    if (result.success) {
      setShipment(result.data);
      setLastUpdated(new Date().toLocaleTimeString());
      
      const historyResult = await fetchTrackingHistory(trackNum);
      if (historyResult.success) {
        setHistory(historyResult.data);
      }
    } else {
      if (showLoading) {
        Alert.alert('Error', 'Shipment not found. Please check the tracking number.');
      }
      setShipment(null);
      setHistory([]);
    }
    
    if (showLoading) setLoading(false);
  };

  // Handle track button press
  const handleTrackShipment = async () => {
    if (!trackingNumber.trim()) {
      Alert.alert('Error', 'Please enter a tracking number');
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await fetchTrackingData(trackingNumber, true);

    // Start auto-refresh every 30 seconds
    intervalRef.current = setInterval(() => {
      if (shipment || trackingNumber) {
        fetchTrackingData(trackingNumber, false);
      }
    }, 30000);
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    if (trackingNumber) {
      await fetchTrackingData(trackingNumber, false);
    }
    setRefreshing(false);
  };

  // Export shipment report
  const exportReport = () => {
    if (!shipment) return;
    
    const report = {
      exportedAt: new Date().toISOString(),
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      currentLocation: shipment.currentLocation,
      lastUpdate: shipment.lastUpdate,
      estimatedDelivery: shipment.estimatedDelivery,
      history: history,
      generatedBy: 'CargoTrack Pro App'
    };
    
    Alert.alert(
      '✅ Report Generated',
      `Shipment report for ${shipment.trackingNumber} is ready!\n\nData has been logged to console.`,
      [{ text: 'OK' }]
    );
    
    console.log('📦 === SHIPMENT REPORT === 📦');
    console.log(JSON.stringify(report, null, 2));
    console.log('📦 === END REPORT === 📦');
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'out for delivery': return '#FF9800';
      case 'in transit': return '#2196F3';
      case 'arrived at hub': return '#9C27B0';
      case 'pending': return '#FFC107';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'checkmark-circle';
      case 'out for delivery': return 'car';
      case 'in transit': return 'airplane';
      case 'arrived at hub': return 'business';
      default: return 'time';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Track Shipment</Text>
            <Text style={styles.subtitle}>Real-time tracking with API</Text>
          </View>
          {shipment && (
            <TouchableOpacity onPress={exportReport} style={styles.exportButton}>
              <Ionicons name="download-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Enter Tracking Number (e.g., CRG-1842)"
            placeholderTextColor="#999"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity 
          style={styles.trackButton} 
          onPress={handleTrackShipment}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.trackButtonText}>Track</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        
        {shipment && (
          <>
            {/* Last Updated Timestamp */}
            {lastUpdated && (
              <View style={styles.updateBadge}>
                <Ionicons name="refresh-outline" size={14} color="#007AFF" />
                <Text style={styles.updateText}>Last updated: {lastUpdated}</Text>
                <Text style={styles.autoRefreshText}>Auto-refresh every 30s</Text>
              </View>
            )}

            {/* Current Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons name="cube-outline" size={24} color="#007AFF" />
                <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
              </View>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(shipment.status) }]}>
                <Ionicons name={getStatusIcon(shipment.status)} size={20} color="#fff" />
                <Text style={styles.statusText}>{shipment.status}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Current Location:</Text>
                <Text style={styles.infoValue}>{shipment.currentLocation}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Last Update:</Text>
                <Text style={styles.infoValue}>{shipment.lastUpdate}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.infoLabel}>Est. Delivery:</Text>
                <Text style={styles.infoValue}>{shipment.estimatedDelivery}</Text>
              </View>
            </View>

            {/* Tracking History */}
            {history.length > 0 && (
              <View style={styles.historyCard}>
                <Text style={styles.historyTitle}>Tracking History</Text>
                {history.map((event, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineDot} />
                      {index !== history.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.eventTime}>{event.time}</Text>
                      <Text style={styles.eventStatus}>{event.status}</Text>
                      <Text style={styles.eventLocation}>{event.location}</Text>
                      <Text style={styles.eventDesc}>{event.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {!shipment && !loading && (
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Enter a tracking number to track your shipment</Text>
            <Text style={styles.emptySubText}>Example: CRG-1842, CRG-1843, CRG-1844</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  exportButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 25 },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  inputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e0e0e0' },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, marginLeft: 10 },
  trackButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  trackButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20 },
  updateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12, gap: 6, flexWrap: 'wrap' },
  updateText: { fontSize: 12, color: '#007AFF' },
  autoRefreshText: { fontSize: 11, color: '#666', marginLeft: 'auto' },
  statusCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  trackingNumber: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginLeft: 10 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 25, marginBottom: 16, gap: 8 },
  statusText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoLabel: { fontSize: 14, color: '#666', marginLeft: 8, width: 110 },
  infoValue: { fontSize: 14, color: '#333', fontWeight: '500', flex: 1 },
  historyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelineLeft: { width: 30, alignItems: 'center', position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#007AFF', marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#e0e0e0', position: 'absolute', top: 20, bottom: -20, left: 14 },
  timelineContent: { flex: 1, paddingBottom: 10 },
  eventTime: { fontSize: 12, color: '#999', marginBottom: 4 },
  eventStatus: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  eventLocation: { fontSize: 14, color: '#666', marginBottom: 2 },
  eventDesc: { fontSize: 12, color: '#999' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#999', fontSize: 16, marginTop: 16, textAlign: 'center' },
  emptySubText: { color: '#ccc', fontSize: 14, marginTop: 8, textAlign: 'center' },
});