import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAllShipments } from '../services/database';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRange, setSelectedRange] = useState('all');
  const [loading, setLoading] = useState(false);

  // Load all shipments
  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    const result = await getAllShipments();
    if (result.success) {
      setShipments(result.data);
      setFilteredShipments(result.data);
    }
  };

  // Quick date range filters
  const setDateRange = (range) => {
    const now = new Date();
    let start = new Date();
    
    switch(range) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        start = new Date(2000, 0, 1);
        break;
      default:
        return;
    }

    const filtered = shipments.filter(item => {
      const itemDate = new Date(item.createdAt).getTime();
      return itemDate >= start.getTime() && itemDate <= now.getTime();
    });

    setSelectedRange(range);
    setFilteredShipments(filtered);
    setStartDate(start.toLocaleDateString());
    setEndDate(now.toLocaleDateString());
    Alert.alert('Filter Applied', `Showing ${filtered.length} shipments`);
  };

  // Filter by custom date range
  const filterByDateRange = () => {
    if (!startDate && !endDate) {
      Alert.alert('Info', 'Please enter both start and end dates');
      return;
    }

    const filtered = shipments.filter(item => {
      const itemDate = new Date(item.createdAt).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      
      if (startDate && endDate) {
        return itemDate >= start && itemDate <= end;
      } else if (startDate) {
        return itemDate >= start;
      } else if (endDate) {
        return itemDate <= end;
      }
      return true;
    });

    setFilteredShipments(filtered);
    setSelectedRange('custom');
    Alert.alert('Success', `Found ${filtered.length} shipments in this range`);
  };

  // Reset filter
  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    setSelectedRange('all');
    setFilteredShipments(shipments);
  };

  // Export as CSV using new FileSystem API
  const exportCSV = async () => {
    if (filteredShipments.length === 0) {
      Alert.alert('No Data', 'No shipments to export');
      return;
    }

    setLoading(true);
    try {
      // Create CSV header
      let csvContent = 'Tracking Number,Sender,Receiver,Origin,Destination,Status,Weight,Date\n';
      
      // Add rows
      filteredShipments.forEach(item => {
        csvContent += `${item.trackingNumber},${item.senderName},${item.receiverName},${item.origin},${item.destination},${item.status},${item.weight || 'N/A'},${item.createdAt || 'N/A'}\n`;
      });

      // Create directory if it doesn't exist
      const dirUri = FileSystem.documentDirectory + 'exports/';
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      }

      // Save file
      const fileName = `shipments_${new Date().toISOString().slice(0,10)}.csv`;
      const fileUri = dirUri + fileName;
      
      // Using the new writeAsStringAsync (still works for now)
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      // Share file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Shipments Data',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to export: ' + error.message);
    }
  };

  // Export as JSON
  const exportJSON = async () => {
    if (filteredShipments.length === 0) {
      Alert.alert('No Data', 'No shipments to export');
      return;
    }

    setLoading(true);
    try {
      const jsonData = JSON.stringify(filteredShipments, null, 2);
      
      const dirUri = FileSystem.documentDirectory + 'exports/';
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
      }

      const fileName = `shipments_${new Date().toISOString().slice(0,10)}.json`;
      const fileUri = dirUri + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Shipments Data',
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to export: ' + error.message);
    }
  };

  // Statistics
  const getStats = () => {
    const total = filteredShipments.length;
    const delivered = filteredShipments.filter(s => s.status === 'Delivered').length;
    const inTransit = filteredShipments.filter(s => s.status === 'In Transit').length;
    const pending = filteredShipments.filter(s => s.status === 'Pending').length;
    const delayed = filteredShipments.filter(s => s.status === 'Delayed').length;

    return { total, delivered, inTransit, pending, delayed };
  };

  const stats = getStats();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Reports</Text>
        <Text style={styles.subtitle}>Manage and export shipment data</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.statValue}>{stats.delivered}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={styles.statValue}>{stats.inTransit}</Text>
          <Text style={styles.statLabel}>In Transit</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
          <Text style={styles.statValue}>{stats.delayed}</Text>
          <Text style={styles.statLabel}>Delayed</Text>
        </View>
      </View>

      {/* Quick Filters */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Filters</Text>
        <View style={styles.filterRow}>
          {['today', 'week', 'month', 'all'].map((range) => (
            <TouchableOpacity 
              key={range}
              style={[styles.filterBtn, selectedRange === range && styles.filterBtnActive]}
              onPress={() => setDateRange(range)}
            >
              <Text style={[styles.filterText, selectedRange === range && styles.filterTextActive]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Date Range */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Range</Text>
        <View style={styles.dateRow}>
          <TextInput
            style={styles.dateInput}
            placeholder="Start (YYYY-MM-DD)"
            placeholderTextColor="#999"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="End (YYYY-MM-DD)"
            placeholderTextColor="#999"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>
        <View style={styles.dateActionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.applyBtn]} onPress={filterByDateRange}>
            <Text style={styles.actionBtnText}>Apply Range</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={resetFilter}>
            <Text style={styles.actionBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Export Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Data</Text>
        <View style={styles.exportRow}>
          <TouchableOpacity style={[styles.exportBtn, styles.csvBtn]} onPress={exportCSV} disabled={loading}>
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.exportText}>Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportBtn, styles.jsonBtn]} onPress={exportJSON} disabled={loading}>
            <Ionicons name="code-outline" size={24} color="#fff" />
            <Text style={styles.exportText}>Export JSON</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          Showing {filteredShipments.length} of {shipments.length} shipments
        </Text>
        {selectedRange !== 'all' && selectedRange !== 'custom' && (
          <Text style={styles.summaryText}>
            Filter: {selectedRange.toUpperCase()}
          </Text>
        )}
        {selectedRange === 'custom' && startDate && endDate && (
          <Text style={styles.summaryText}>
            Filter: {startDate} to {endDate}
          </Text>
        )}
        {selectedRange === 'all' && (
          <Text style={styles.summaryText}>Showing all shipments</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  dateActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtn: {
    backgroundColor: '#007AFF',
  },
  resetBtn: {
    backgroundColor: '#F44336',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  exportRow: {
    flexDirection: 'row',
    gap: 12,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  csvBtn: {
    backgroundColor: '#4CAF50',
  },
  jsonBtn: {
    backgroundColor: '#FF9800',
  },
  exportText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});