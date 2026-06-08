import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initDatabase } from './database';

export default function Layout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            title: 'Login',
            drawerLabel: 'Login',
            drawerItemStyle: { display: 'none' }, // Hide login from drawer
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            drawerLabel: '📊 Dashboard',
            headerTitle: 'Dashboard',
          }}
        />
        <Drawer.Screen
          name="students"
          options={{
            title: 'Student List',
            drawerLabel: '📋 Student List',
            headerTitle: 'Students',
          }}
        />
        <Drawer.Screen
          name="add-student"
          options={{
            title: 'Add Student',
            drawerLabel: '✨ Add Student',
            headerTitle: 'Add New Student',
            drawerItemStyle: { display: 'none' }, // Hide from drawer, accessed via button
          }}
        />
        <Drawer.Screen
          name="edit-student"
          options={{
            title: 'Edit Student',
            drawerLabel: 'Edit Student',
            headerTitle: 'Edit Student',
            drawerItemStyle: { display: 'none' }, // Hide from drawer
          }}
        />
        <Drawer.Screen
          name="register"
          options={{
            title: 'Register',
            drawerLabel: 'Register',
            drawerItemStyle: { display: 'none' }, // Hide old register screen
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}