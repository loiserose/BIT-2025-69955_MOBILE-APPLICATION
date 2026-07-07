import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DeviceFeaturesScreen() {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (!hasCameraPermission) {
      Alert.alert('Permission Denied', 'Please allow camera access in settings.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const getCurrentLocation = async () => {
    if (!hasLocationPermission) {
      Alert.alert('Permission Denied', 'Please allow location access in settings.');
      return;
    }

    setLoadingLocation(true);
    try {
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(locationData.coords);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location: ' + error.message);
    }
    setLoadingLocation(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>📱 Device Features</Text>
          <Text style={styles.subtitle}>Camera • GPS • Sensors</Text>
        </View>

        {/* Camera Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📷 Camera</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cameraBtn]} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.galleryBtn]} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#fff" />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          {photo && (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
              <TouchableOpacity onPress={() => setPhoto(null)} style={styles.removeBtn}>
                <Ionicons name="close-circle" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* GPS Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 GPS Location</Text>
          <TouchableOpacity style={[styles.button, styles.locationBtn]} onPress={getCurrentLocation} disabled={loadingLocation}>
            {loadingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="location" size={24} color="#fff" />
                <Text style={styles.buttonText}>Get Location</Text>
              </>
            )}
          </TouchableOpacity>
          {location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
              <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
            </View>
          )}
        </View>

        {/* Smart Feature */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔄 Smart Feature</Text>
          <TouchableOpacity style={[styles.button, styles.smartBtn]} onPress={() => {
            takePhoto();
            setTimeout(getCurrentLocation, 1000);
          }}>
            <Ionicons name="camera" size={24} color="#fff" />
            <Text style={styles.buttonText}>Capture + Location</Text>
            <Ionicons name="location" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cameraBtn: {
    backgroundColor: '#4CAF50',
  },
  galleryBtn: {
    backgroundColor: '#2196F3',
  },
  locationBtn: {
    backgroundColor: '#FF9800',
  },
  smartBtn: {
    backgroundColor: '#9C27B0',
  },
  photoContainer: {
    marginTop: 12,
    alignItems: 'center',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  locationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
});