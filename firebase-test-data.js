// Firebase Test Data - Your IoT Sensor Data Structure
// This shows the expected data structure for your dashboard

const testData = {
  // Your IoT sensor data structure
  lionbit: {
    device01: {
      logs: {
        "-OkXCiWQhcGEOwy7FpwQ": {
          gas: 271,
          humidity: 89,
          temperature: 35,
          time: 6364,
        },
        // Add more log entries for better chart visualization
        "-OkXCiWQhcGEOwy7FpwR": {
          gas: 265,
          humidity: 87,
          temperature: 34,
          time: 6365,
        },
        "-OkXCiWQhcGEOwy7FpwS": {
          gas: 268,
          humidity: 88,
          temperature: 36,
          time: 6366,
        },
        "-OkXCiWQhcGEOwy7FpwT": {
          gas: 272,
          humidity: 90,
          temperature: 37,
          time: 6367,
        },
        "-OkXCiWQhcGEOwy7FpwU": {
          gas: 269,
          humidity: 86,
          temperature: 33,
          time: 6368,
        },
        "-OkXCiWQhcGEOwy7FpwV": {
          gas: 275,
          humidity: 91,
          temperature: 38,
          time: 6369,
        },
        "-OkXCiWQhcGEOwy7FpwW": {
          gas: 267,
          humidity: 85,
          temperature: 32,
          time: 6370,
        },
        "-OkXCiWQhcGEOwy7FpwX": {
          gas: 273,
          humidity: 89,
          temperature: 35,
          time: 6371,
        },
      },
    },
  },

  // Dashboard system data with IoT-specific metrics
  dashboard: {
    lastUpdated: new Date().toISOString(),
    status: "active",
    metrics: {
      totalDevices: 3, // Number of IoT devices connected
      totalReadings: 8542, // Total sensor readings collected
      activeAlerts: 2, // Number of active sensor alerts
    },
  },

  // Example of other data you might store
  devices: {
    device01: {
      name: "Living Room Sensor",
      location: "Living Room",
      status: "online",
      lastSeen: new Date().toISOString(),
    },
  },
};

// To add this data to Firebase Console:
// 1. Go to https://console.firebase.google.com/
// 2. Select your "lionbit-test" project
// 3. Go to Realtime Database
// 4. Click on the data and paste this structure
//
// The enhanced dashboard will now show:
// - Beautiful gradient cards with sensor data and icons
// - Interactive charts showing temperature and humidity trends
// - Enhanced table with icons and status badges
// - Modern dark theme with glassmorphism effects
// - Real-time updates and connection status

export default testData;
