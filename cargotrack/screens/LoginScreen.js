import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { validateLogin } from '../services/auth';

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation 1: Check if fields are empty
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    // Validation 2: Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    // Validation 3: Check password length
    if (password.length < 4) {
      Alert.alert('Validation Error', 'Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    // Validate against database
    const result = await validateLogin(email, password);
    
    setLoading(false);

    if (result.success) {
      setIsLoggedIn(true);
    } else {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.\n\nDemo credentials:\nuser@cargotrack.com / 123456');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>CargoTrack Pro</Text>
          <Text style={styles.subtitle}>Smart Logistics & ETA System</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.welcomeText}>Welcome Back</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
          
          {/* Demo credentials hint */}
          <View style={styles.demoHint}>
            <Text style={styles.demoText}>Demo: user@cargotrack.com / 123456</Text>
          </View>
        </View>

        <Text style={styles.footer}>© 2026 CargoTrack Pro. All rights reserved.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 40 },
  header: { alignItems: 'center', marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#007AFF' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 8 },
  form: { marginTop: 40 },
  welcomeText: { fontSize: 24, fontWeight: '600', color: '#333', marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: '#007AFF', fontSize: 14 },
  loginButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  loginButtonDisabled: { backgroundColor: '#99c2ff' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  signupText: { color: '#666', fontSize: 14 },
  signupLink: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  demoHint: { marginTop: 16, alignItems: 'center' },
  demoText: { color: '#999', fontSize: 12 },
  footer: { textAlign: 'center', color: '#999', fontSize: 12, marginBottom: 20 },
});