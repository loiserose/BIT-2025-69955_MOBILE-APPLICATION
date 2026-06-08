import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen({ navigation, setIsLoggedIn }) {
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => setIsLoggedIn(false)
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      <Text style={styles.subtitle}>Manage your account</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.userName}>John Anderson</Text>
        <Text style={styles.userRole}>Logistics Manager</Text>
        <Text style={styles.userInfo}>Member since Jan 2024</Text>
        <View style={styles.contactInfo}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.contactText}>john.anderson@company.com</Text>
        </View>
        <View style={styles.contactInfo}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.contactText}>Global Logistics Corp.</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person-outline" size={24} color="#007AFF" />
          <Text style={styles.settingText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="#007AFF" />
          <Text style={styles.settingText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield-outline" size={24} color="#007AFF" />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
          <Text style={styles.settingText}>General Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <Ionicons name="notifications" size={24} color="#007AFF" />
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fc', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 20 },
  avatar: { marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  userRole: { fontSize: 14, color: '#666', marginBottom: 4 },
  userInfo: { fontSize: 12, color: '#999', marginBottom: 15 },
  contactInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  contactText: { fontSize: 14, color: '#666' },
  editButton: { marginTop: 15, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#007AFF', borderRadius: 20 },
  editButtonText: { color: '#fff', fontWeight: '600' },
  settingsSection: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, overflow: 'hidden' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', padding: 16, paddingBottom: 8 },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f0f0f0', gap: 12 },
  settingText: { flex: 1, fontSize: 16, color: '#333' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 30,
  },
});