import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const stats = [
    { label: 'Active Shipments', value: '24', icon: 'cube-outline', color: '#007AFF' },
    { label: 'Delivered Today', value: '12', icon: 'checkmark-circle-outline', color: '#34C759' },
    { label: 'Delayed Shipments', value: '3', icon: 'alert-circle-outline', color: '#FF3B30' },
  ];

  const recentActivities = [
    { id: 'CRG-1842', status: 'Delivered', time: '2 hours ago', statusColor: '#34C759' },
    { id: 'CRG-1843', status: 'In Transit', time: '4 hours ago', statusColor: '#007AFF' },
    { id: 'CRG-1844', status: 'Delayed', time: '6 hours ago', statusColor: '#FF3B30' },
  ];

  const quickActions = [
    { name: 'Track Cargo', icon: 'map-outline', color: '#007AFF', screen: 'Tracking' },
    { name: 'Create Shipment', icon: 'add-circle-outline', color: '#34C759', screen: 'Shipments' },
    { name: 'View Reports', icon: 'stats-chart-outline', color: '#FF9500', screen: 'Reports' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Blue Header Section */}
      <View style={styles.blueHeader}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>John Anderson</Text>
            <Text style={styles.userRole}>Logistics Manager</Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={50} color="#fff" />
          </View>
        </View>
      </View>

      {/* Stats Cards - overlapping the blue header */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconCircle, { backgroundColor: stat.color + '15' }]}>
              <Ionicons name={stat.icon} size={28} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Live Shipment Map Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Live Shipment Map</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tracking')}>
            <Text style={styles.linkText}>View Full Map →</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.mapBox}
          onPress={() => navigation.navigate('Tracking')}
        >
          <Ionicons name="map" size={50} color="#007AFF" />
          <Text style={styles.mapText}>24 active cargo locations</Text>
          <Text style={styles.mapSubText}>Tap to view live tracking →</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={[styles.card, styles.lastCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentActivities.map((activity, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.activityItem}
            onPress={() => navigation.navigate('Tracking')}
          >
            <View style={styles.activityLeft}>
              <Text style={styles.activityId}>{activity.id}</Text>
              <Text style={[styles.activityStatus, { color: activity.statusColor }]}>
                {activity.status}
              </Text>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },
  // Blue Header
  blueHeader: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  userRole: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: (width - 50) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  // Cards
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  lastCard: {
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '500',
  },
  // Map Box
  mapBox: {
    height: 140,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF20',
  },
  mapText: {
    marginTop: 10,
    color: '#444',
    fontSize: 14,
    fontWeight: '500',
  },
  mapSubText: {
    marginTop: 5,
    color: '#007AFF',
    fontSize: 12,
  },
  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 70) / 3,
  },
  actionIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  // Recent Activity
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityLeft: {
    flex: 1,
  },
  activityId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  activityStatus: {
    fontSize: 13,
    marginTop: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});