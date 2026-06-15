import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchDashboardStats } from '../services/api';
import { getAllShipments } from '../services/database';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    totalShipments: 0,
    activeShipments: 0,
    deliveredToday: 0,
    delayedShipments: 0,
    recentShipments: []
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [localCount, setLocalCount] = useState(0);

  // Load dashboard data from API and local database
  const loadDashboardData = async () => {
    setLoading(true);
    
    // Fetch from API
    const apiResult = await fetchDashboardStats();
    if (apiResult.success) {
      setStats(apiResult.data);
    }
    
    // Fetch local shipment count
    const localResult = await getAllShipments();
    if (localResult.success) {
      setLocalCount(localResult.data.length);
    }
    
    setLoading(false);
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const statsCards = [
    { 
      label: 'Total Shipments', 
      value: stats.totalShipments + localCount, 
      icon: 'cube-outline', 
      color: '#007AFF',
      bgColor: '#E3F2FD'
    },
    { 
      label: 'Active Shipments', 
      value: stats.activeShipments, 
      icon: 'trending-up-outline', 
      color: '#FF9800',
      bgColor: '#FFF3E0'
    },
    { 
      label: 'Delivered Today', 
      value: stats.deliveredToday, 
      icon: 'checkmark-circle-outline', 
      color: '#4CAF50',
      bgColor: '#E8F5E9'
    },
    { 
      label: 'Delayed', 
      value: stats.delayedShipments, 
      icon: 'alert-circle-outline', 
      color: '#F44336',
      bgColor: '#FFEBEE'
    },
  ];

  const quickActions = [
    { name: 'Track Cargo', icon: 'map-outline', color: '#007AFF', screen: 'Tracking', isNested: false },
    { name: 'New Shipment', icon: 'add-circle-outline', color: '#4CAF50', screen: 'AddShipment', isNested: true },
    { name: 'View All', icon: 'list-outline', color: '#FF9800', screen: 'Shipments', isNested: false },
    { name: 'Reports', icon: 'stats-chart-outline', color: '#9C27B0', screen: 'Reports', isNested: false },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.title}>CargoTrack Dashboard</Text>
        <Text style={styles.subtitle}>Real-time shipment tracking</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statsCards.map((stat, index) => (
          <View key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => {
                if (action.isNested) {
                  navigation.navigate('Shipments', { screen: action.screen });
                } else {
                  navigation.navigate(action.screen);
                }
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionName}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Shipments from API */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Shipments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Shipments')}>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>
        
        {stats.recentShipments.slice(0, 3).map((shipment, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentCard}
            onPress={() => Alert.alert('Shipment Details', `Tracking: ${shipment.trackingNumber}\nStatus: ${shipment.status}\nFrom: ${shipment.origin}\nTo: ${shipment.destination}`)}
          >
            <View style={styles.recentHeader}>
              <Text style={styles.recentTracking}>{shipment.trackingNumber}</Text>
              <View style={[
                styles.recentStatus, 
                { backgroundColor: 
                  shipment.status === 'Delivered' ? '#4CAF50' : 
                  shipment.status === 'In Transit' ? '#FF9800' : '#9E9E9E'
                }
              ]}>
                <Text style={styles.recentStatusText}>{shipment.status}</Text>
              </View>
            </View>
            <Text style={styles.recentRoute}>{shipment.origin} → {shipment.destination}</Text>
          </TouchableOpacity>
        ))}

        {stats.recentShipments.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="cube-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No recent shipments</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Shipments', { screen: 'AddShipment' })}>
              <Text style={styles.emptyButtonText}>Add Shipment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Local Database Info */}
      <View style={styles.infoCard}>
        <Ionicons name="server-outline" size={24} color="#007AFF" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Local Storage</Text>
          <Text style={styles.infoText}>{localCount} shipments saved locally</Text>
        </View>
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#fff', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 20 },
  greeting: { fontSize: 14, color: '#666', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 12, color: '#999', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 12 },
  statCard: { width: (width - 48) / 2, padding: 16, borderRadius: 16, marginBottom: 12 },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666' },
  section: { padding: 20, paddingBottom: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAll: { fontSize: 14, color: '#007AFF' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: (width - 64) / 4, alignItems: 'center', padding: 12, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  actionIcon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionName: { fontSize: 11, color: '#333', textAlign: 'center' },
  recentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  recentTracking: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  recentStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  recentStatusText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  recentRoute: { fontSize: 12, color: '#666' },
  emptyCard: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderRadius: 12 },
  emptyText: { color: '#999', fontSize: 14, marginTop: 10 },
  emptyButton: { marginTop: 12, backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  emptyButtonText: { color: '#fff', fontSize: 12 },
  infoCard: { flexDirection: 'row', alignItems: 'center', margin: 20, padding: 15, backgroundColor: '#E3F2FD', borderRadius: 12, gap: 12 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  infoText: { fontSize: 12, color: '#666' },
});