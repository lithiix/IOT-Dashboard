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
        // Add more log entries as needed
        "-OkXCiWQhcGEOwy7FpwR": {
          gas: 265,
          humidity: 87,
          temperature: 34,
          time: 6365,
        },
      },
    },
  },

  // Dashboard system data
  dashboard: {
    lastUpdated: new Date().toISOString(),
    status: "active",
    metrics: {
      users: 1234,
      revenue: 56789,
      orders: 456,
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

export default testData;
