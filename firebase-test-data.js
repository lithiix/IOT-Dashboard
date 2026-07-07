const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push } = require('firebase/database');

// 1. Manually parse .env.local if present to load Firebase environment variables
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index > -1) {
          const key = trimmed.substring(0, index).trim();
          const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
          process.env[key] = val;
        }
      }
    });
    console.log('Successfully loaded environment variables from .env.local');
  } else {
    console.log('.env.local file not found, using system environment variables.');
  }
} catch (err) {
  console.warn('Could not read or parse .env.local:', err.message);
}

// 2. Extract Firebase configurations
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate credentials
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL || !firebaseConfig.projectId) {
  console.error('\n[ERROR] Missing Firebase Credentials!');
  console.error('Please verify that .env.local exists in the project root and includes the following variables:\n');
  console.error('  NEXT_PUBLIC_FIREBASE_API_KEY');
  console.error('  NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.error('  NEXT_PUBLIC_FIREBASE_DATABASE_URL');
  console.error('\nSee README.md for instructions.');
  process.exit(1);
}

// 3. Initialize Firebase Database Client
console.log('Connecting to Firebase project:', firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const logsRef = ref(db, 'lionbit/device01/logs');

console.log('\n======================================================');
console.log('Starting Live IoT Sensor Simulation...');
console.log('Target Path: lionbit/device01/logs');
console.log('Interval:    1000ms (1 second)');
console.log('Parameters:  pH, conductivity (EC), oxygen, waterTemp, envTemp, envHumidity');
console.log('======================================================');
console.log('Press Ctrl+C to terminate simulation.\n');

// 4. Start pushing randomized telemetry packet every 1 second
setInterval(async () => {
  // ph: 6.5 to 8.5 (float, 2 decimal places)
  const ph = parseFloat((6.5 + Math.random() * 2.0).toFixed(2));
  
  // conductivity: 300 to 800 (integer)
  const conductivity = Math.round(300 + Math.random() * 500);
  
  // oxygen: 5.0 to 10.0 (float, 2 decimal places)
  const oxygen = parseFloat((5.0 + Math.random() * 5.0).toFixed(2));
  
  // waterTemp: 20.0 to 30.0 (float, 2 decimal places)
  const waterTemp = parseFloat((20.0 + Math.random() * 10.0).toFixed(2));
  
  // envTemp: 25.0 to 35.0 (float, 2 decimal places)
  const envTemp = parseFloat((25.0 + Math.random() * 10.0).toFixed(2));
  
  // envHumidity: 50 to 90 (integer)
  const envHumidity = Math.round(50 + Math.random() * 40);

  const logEntry = {
    ph,
    conductivity,
    ec: conductivity, // mapped to 'ec' for dashboard client compatibility
    oxygen,
    waterTemp,
    envTemp,
    envHumidity,
    time: Date.now()
  };

  try {
    await push(logsRef, logEntry);
    console.log(`[${new Date().toLocaleTimeString()}] Pushed telemetry:`, JSON.stringify(logEntry));
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] Push failed:`, error.message);
  }
}, 1000);
