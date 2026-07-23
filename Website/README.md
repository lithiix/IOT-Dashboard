# Realtime Dashboard with Firebase

A Next.js dashboard application that displays real-time data from Firebase Realtime Database, ready for deployment on Vercel.

🔗 **Live Demo**: [https://iot-dashboard-ruby.vercel.app/](https://iot-dashboard-ruby.vercel.app/)

## Features

- Real-time data synchronization with Firebase Realtime Database
- Responsive dashboard UI with Tailwind CSS
- TypeScript support
- Firebase Analytics integration
- Vercel deployment ready
- Connection status monitoring

## Firebase Project Setup

This project uses Firebase Realtime Database for data storage and synchronization.

### Environment Variables

Create a `.env.local` file in the root directory with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Note**: Never commit the `.env.local` file to version control. It's already included in `.gitignore`.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

### 3. Test Firebase Connection

1. Open the dashboard in your browser
2. Verify that your IoT device data is being displayed in real-time
3. Check the connection status indicator (Online/Offline/Checking)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Firebase provider
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Global styles
├── components/
│   └── Dashboard.tsx       # Main dashboard component
├── contexts/
│   └── FirebaseContext.tsx # Firebase context provider
├── hooks/
│   └── useFirebase.ts      # Custom Firebase hooks
├── lib/
│   └── firebase.ts         # Firebase configuration
└── .env.local              # Environment variables (not committed)
```

## Firebase Data Structure

The dashboard displays data from your Firebase Realtime Database with this structure:

### IoT Sensor Data

```json
{
  "lionbit": {
    "device01": {
      "logs": {
        "unique_log_id": {
          "gas": 271,
          "humidity": 89,
          "temperature": 35,
          "time": 6364
        }
      }
    }
  }
}
```

### Dashboard System Data

```json
{
  "dashboard": {
    "lastUpdated": "2024-01-01T00:00:00.000Z",
    "status": "active",
    "metrics": {
      "totalDevices": 3,
      "totalReadings": 8542,
      "activeAlerts": 2
    }
  }
}
```

## Custom Hooks

### `useRealtimeData(path: string)`

Fetches and listens to real-time data from a Firebase path.

```tsx
const { data, loading, error } = useRealtimeData("dashboard");
```

### `useRealtimeList(path: string)`

Converts Firebase object data to an array with IDs.

```tsx
const { list, loading, error } = useRealtimeList("items");
```

### `useFirebaseMutation()`

Provides methods to write, update, and delete Firebase data.

```tsx
const { writeData, pushData, updateData, deleteData } = useFirebaseMutation();

// Write data
await writeData("path/to/data", { key: "value" });

// Push new item
await pushData("path/to/list", { item: "data" });

// Update existing data
await updateData("path/to/data", { key: "newValue" });

// Delete data
await deleteData("path/to/data");
```

## Dashboard Features

- **🎨 Modern Dark UI**: Beautiful gradient backgrounds with glassmorphism effects
- **📊 Real-time Charts**: Interactive temperature and humidity trend charts
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔴 Live Sensor Cards**: Gradient cards with icons for temperature, humidity, gas, and timestamp
- **📋 Enhanced Data Table**: Improved sensor logs with status indicators and icons
- **⚡ Real-time Updates**: Automatic data synchronization across all connected clients
- **🔗 Connection Status**: Visual Firebase connection indicator with animations
- **🎯 Interactive Elements**: Hover effects, loading states, and smooth transitions
- **📈 System Metrics**: Additional dashboard metrics with gradient cards
- **🔄 Loading Animations**: Beautiful loading spinners and skeleton states
- **🎨 Status Badges**: Color-coded status indicators for sensor readings

## Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard (copy from `.env.local`)
4. Deploy!

## Firebase Console

Access your Firebase project at: https://console.firebase.google.com/project/lionbit-test

- **Realtime Database**: View and edit data at https://console.firebase.google.com/project/lionbit-test/database
- **Analytics**: Monitor usage at https://console.firebase.google.com/project/lionbit-test/analytics

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS with custom gradients and animations
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography
- **Database**: Firebase Realtime Database
- **Deployment**: Vercel (recommended)

## Dependencies

### Core Dependencies

- `next`: ^16.1.6 - React framework
- `react`: ^19.2.4 - UI library
- `firebase`: ^12.8.0 - Database and analytics

### UI Enhancement Dependencies

- `recharts`: ^2.12.0 - Chart library for data visualization
- `lucide-react`: ^0.344.0 - Beautiful icons
- `tailwindcss`: ^4.0.0 - Utility-first CSS framework
