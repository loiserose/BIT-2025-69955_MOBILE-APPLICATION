import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ReportsScreen() {
  const stats = [
    { label: 'Total Shipments', value: '1,247', change: '+12%', icon: 'cube-outline', color: '#007AFF' },
    { label: 'On-Time Delivery', value: '94.2%', change: '+2.1%', icon: 'checkmark-circle-outline', color: '#34C759' },
    { label: 'Avg Delivery Time', value: '2.8 days', change: '-0.3', icon: 'time-outline', color: '#FF9500' },
    { label: 'Active Routes', value: '38', change: '+5', icon: 'map-outline', color: '#AF52DE' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [65, 72, 88, 84, 91, 78, 65];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reports & Analytics</Text>
      <Text style={styles.subtitle}>Performance insights and data</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Ionicons name={stat.icon} size={24} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statChange, { color: stat.change.startsWith('+') ? '#34C759' : '#FF3B30' }]}>
              {stat.change} from last month
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.chartSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shipment Trends</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {data.map((value, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: value * 2 }]} />
                <Text style={styles.barLabel}>{days[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonOutline}>
          <Ionicons name="calendar-outline" size={20} color="#007AFF" />
          <Text style={styles.actionButtonOutlineText}>Custom Range</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, width: '48%', marginBottom: 15, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 10 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  statChange: { fontSize: 10, marginTop: 6 },
  chartSection: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  viewAllLink: { color: '#007AFF', fontSize: 14 },
  chartContainer: { alignItems: 'center' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%' },
  barWrapper: { alignItems: 'center', flex: 1 },
  bar: { width: 30, backgroundColor: '#007AFF', borderRadius: 4, marginBottom: 8 },
  barLabel: { fontSize: 11, color: '#666' },
  actionsSection: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  actionButton: { flex: 1, backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionButtonText: { color: '#fff', fontWeight: '600' },
  actionButtonOutline: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#007AFF' },
  actionButtonOutlineText: { color: '#007AFF', fontWeight: '600' },
});