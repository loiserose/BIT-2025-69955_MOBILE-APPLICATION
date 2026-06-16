import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('cargotrack.db');

// Initialize users table
export const initAuthDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        password TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Auth database initialized');
    
    // Insert demo user if not exists
    const existingUser = await db.getFirstAsync("SELECT * FROM users WHERE email = 'user@cargotrack.com'");
    if (!existingUser) {
      await db.runAsync(
        "INSERT INTO users (fullName, email, phone, password) VALUES (?, ?, ?, ?)",
        'Demo User',
        'user@cargotrack.com',
        '0712345678',
        '123456'
      );
      console.log('Demo user created');
    }
  } catch (error) {
    console.error('Auth init error:', error);
  }
};

// Validate login credentials
export const validateLogin = async (email, password) => {
  try {
    const user = await db.getFirstAsync(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      email.toLowerCase(),
      password
    );
    
    if (user) {
      return { success: true, user: { id: user.id, name: user.fullName, email: user.email } };
    }
    return { success: false, error: 'Invalid email or password' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Database error' };
  }
};

// Register new user
export const registerUser = async (fullName, email, phone, password) => {
  try {
    // Check if user exists
    const existingUser = await db.getFirstAsync("SELECT * FROM users WHERE email = ?", email.toLowerCase());
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }
    
    // Insert new user
    await db.runAsync(
      "INSERT INTO users (fullName, email, phone, password) VALUES (?, ?, ?, ?)",
      fullName,
      email.toLowerCase(),
      phone,
      password
    );
    
    return { success: true };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: error.message };
  }
};