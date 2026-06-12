import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAllShipments, deleteShipment, searchShipments } from '../services/database';

export default function ShipmentsScreen({ navigation }) {
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load shipments from database
  const loadShipments = async () => {
    const result = await getAllShipments();
    if (result.success) {
      setShipments(result.data);
    } else {
      console.error('Failed to load shipments:', result.error);
    }
  };

  // Search shipments
  const handleSearch = async () => {
    if (!searchText.trim()) {
      setIsSearching(false);
      loadShipments();
      return;
    }
    setIsSearching(true);
    const result = await searchShipments(searchText);
    if (result.success) {
      setShipments(result.data);
    }
  };

  // Delete shipment
  const handleDelete = (id, trackingNumber) => {
    Alert.alert(
      'Delete Shipment',
      `Delete shipment ${trackingNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteShipment(id);
            if (result.success) {
              Alert.alert('Success', 'Shipment deleted');
              loadShipments();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
  }, []);

  // Load shipments when screen opens
  useEffect(() => {
    loadShipments();
    const unsubscribe = navigation.addListener('focus', () => {
      loadShipments();
    });
    return unsubscribe;
  }, [navigation]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'In Transit': return '#FF9800';
      case 'Delayed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Render each shipment item
  const renderShipment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.route}>{item.origin} → {item.destination}</Text>
        <Text style={styles.party}>Sender: {item.senderName}</Text>
        <Text style={styles.party}>Receiver: {item.receiverName}</Text>
      </View>
      
      <View style={styles.cardFooter}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => navigation.navigate('EditShipment', { shipment: item })}>
          <Ionicons name="create-outline" size={22} color="#FF9800" />
          <Text style={[styles.footerButtonText, { color: '#FF9800' }]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => handleDelete(item.id, item.trackingNumber)}>
          <Ionicons name="trash-outline" size={22} color="#F44336" />
          <Text style={[styles.footerButtonText, { color: '#F44336' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Shipments</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddShipment')}>
          <Ionicons name="add-circle" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by tracking number, sender, receiver..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => { 
            setSearchText(''); 
            setIsSearching(false); 
            loadShipments(); 
          }}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {/* Shipments List */}
      <FlatList
        data={shipments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShipment}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No shipments found</Text>
            <Text style={styles.emptySubText}>Tap the + button to add your first shipment</Text>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={() => navigation.navigate('AddShipment')}>
              <Text style={styles.emptyButtonText}>Add Your First Shipment</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={shipments.length === 0 ? styles.emptyList : styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  addButton: { padding: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  searchButton: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginLeft: 8 },
  searchButtonText: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyList: { flex: 1 },
  card: { backgroundColor: '#fff', marginBottom: 12, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  trackingNumber: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cardBody: { marginBottom: 12 },
  route: { fontSize: 14, color: '#666', marginBottom: 4 },
  party: { fontSize: 14, color: '#666', marginBottom: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
  footerButton: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerButtonText: { fontSize: 14, color: '#007AFF', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#999', fontSize: 16, marginTop: 16 },
  emptySubText: { color: '#ccc', fontSize: 14, marginTop: 8 },
  emptyButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 20 },
  emptyButtonText: { color: '#fff', fontSize: 14 },
});