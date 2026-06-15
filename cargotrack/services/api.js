import axios from 'axios';

// Using a free public tracking API (mock data for demo)
// For real cargo tracking, you would use: AfterShip, Ship24, etc.
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch real-time shipment tracking from API
export const fetchRealTimeTracking = async (trackingNumber) => {
  try {
    // Simulate API call - in production, replace with real tracking API
    const response = await api.get(`/posts/${parseInt(trackingNumber) || 1}`);
    
    // Mock tracking data based on tracking number
    const statuses = ['Pending', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered'];
    const locations = ['Nairobi Hub', 'Mombasa Port', 'Kisumu Warehouse', 'Eldoret Depot', 'Nakuru Center'];
    const randomIndex = (parseInt(trackingNumber) || 1) % 5;
    
    return {
      success: true,
      data: {
        trackingNumber: trackingNumber,
        status: statuses[randomIndex],
        currentLocation: locations[randomIndex],
        lastUpdate: new Date().toLocaleString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      }
    };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// Fetch tracking history
export const fetchTrackingHistory = async (trackingNumber) => {
  try {
    // Mock tracking history
    const history = [
      { time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleString(), 
        status: 'Order Processed', location: 'Online', description: 'Shipment information received' },
      { time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), 
        status: 'Picked Up', location: 'Nairobi', description: 'Shipment picked up by carrier' },
      { time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleString(), 
        status: 'In Transit', location: 'Mombasa Road', description: 'Shipment in transit to destination' },
      { time: new Date().toLocaleString(), 
        status: 'Arrived', location: 'Mombasa', description: 'Shipment arrived at destination hub' },
    ];
    
    return { success: true, data: history };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
};

// Fetch multiple shipments from API (for dashboard)
export const fetchDashboardStats = async () => {
  try {
    // Mock API data for dashboard
    const response = await api.get('/posts?_limit=5');
    
    return {
      success: true,
      data: {
        totalShipments: 156,
        activeShipments: 24,
        deliveredToday: 12,
        delayedShipments: 3,
        recentShipments: response.data.map((item, index) => ({
          id: item.id,
          trackingNumber: `CRG-${1000 + item.id}`,
          status: ['Pending', 'In Transit', 'Delivered'][index % 3],
          origin: ['Nairobi', 'Mombasa', 'Kisumu'][index % 3],
          destination: ['Mombasa', 'Nairobi', 'Eldoret'][(index + 1) % 3],
        }))
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};