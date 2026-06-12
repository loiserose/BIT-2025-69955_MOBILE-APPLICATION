import * as SQLite from 'expo-sqlite';

// Open database
const db = SQLite.openDatabaseSync('cargotrack.db');

// Initialize database tables
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shipments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trackingNumber TEXT NOT NULL UNIQUE,
        senderName TEXT NOT NULL,
        receiverName TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        status TEXT NOT NULL,
        weight REAL,
        description TEXT,
        estimatedDelivery TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database init error:', error);
    return false;
  }
};

// CREATE - Add new shipment
export const addShipment = async (shipment) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO shipments (trackingNumber, senderName, receiverName, origin, destination, status, weight, description, estimatedDelivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      shipment.trackingNumber,
      shipment.senderName,
      shipment.receiverName,
      shipment.origin,
      shipment.destination,
      shipment.status || 'Pending',
      shipment.weight || null,
      shipment.description || null,
      shipment.estimatedDelivery || null
    );
    console.log('Shipment added:', result);
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    console.error('Add shipment error:', error);
    return { success: false, error: error.message };
  }
};

// READ - Get all shipments
export const getAllShipments = async () => {
  try {
    const shipments = await db.getAllAsync('SELECT * FROM shipments ORDER BY id DESC');
    return { success: true, data: shipments };
  } catch (error) {
    console.error('Get shipments error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// READ - Search shipments
export const searchShipments = async (searchTerm) => {
  try {
    const shipments = await db.getAllAsync(
      `SELECT * FROM shipments 
       WHERE trackingNumber LIKE ? 
       OR senderName LIKE ? 
       OR receiverName LIKE ? 
       OR destination LIKE ?
       ORDER BY id DESC`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`
    );
    return { success: true, data: shipments };
  } catch (error) {
    console.error('Search shipments error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

// DELETE - Delete shipment
export const deleteShipment = async (id) => {
  try {
    await db.runAsync('DELETE FROM shipments WHERE id = ?', id);
    return { success: true };
  } catch (error) {
    console.error('Delete shipment error:', error);
    return { success: false, error: error.message };
  }
};
// UPDATE - Update shipment
export const updateShipment = async (id, shipment) => {
  try {
    await db.runAsync(
      `UPDATE shipments SET 
        senderName = ?, 
        receiverName = ?, 
        origin = ?, 
        destination = ?, 
        status = ?, 
        weight = ?, 
        description = ?, 
        estimatedDelivery = ?
       WHERE id = ?`,
      shipment.senderName,
      shipment.receiverName,
      shipment.origin,
      shipment.destination,
      shipment.status,
      shipment.weight || null,
      shipment.description || null,
      shipment.estimatedDelivery || null,
      id
    );
    return { success: true };
  } catch (error) {
    console.error('Update shipment error:', error);
    return { success: false, error: error.message };
  }
};