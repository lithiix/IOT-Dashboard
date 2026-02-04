# Realtime Dashboard with Firebase

A Next.js dashboard application that displays real-time data from Firebase Realtime Database, ready for deployment on Vercel.

## Features

- Real-time data synchronization with Firebase Realtime Database
- Responsive dashboard UI with Tailwind CSS
- TypeScript support
- Firebase Analytics integration
- Vercel deployment ready
- Connection status monitoring

## Firebase Project Setup

This project is configured to work with the **lionbit-test** Firebase project.

### Current Firebase Configuration:

- **Project ID**: lionbit-test
- **Database URL**: https://lionbit-test-default-rtdb.firebaseio.com
- **Analytics**: Enabled

### Environment Variables

The `.env.local` file is already configured with your Firebase credentials. The file contains:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDhSHZpKn0A4CAnJA1BbOjQyonOWk4HizM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lionbit-test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://lionbit-test-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lionbit-test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lionbit-test.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=783632941074
NEXT_PUBLIC_FIREBASE_APP_ID=1:783632941074:web:9e1b8566467c3ef4ce58cb
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-YFNVTY8NY0
```

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

1. Click "Test Firebase Connection" to verify the setup
2. Click "Update Dashboard Data" to generate sample metrics
3. Watch the data update in real-time across multiple browser tabs

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
      "users": 1234,
      "revenue": 56789,
      "orders": 456
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

- **Real-time Sensor Data**: Displays latest temperature, humidity, gas level, and timestamp from device01
- **Sensor Logs History**: Table showing the last 10 sensor readings with Firebase log IDs
- **Connection Status**: Visual indicator showing Firebase connection status
- **System Metrics**: Additional dashboard metrics for users, revenue, and orders
- **Error Handling**: Graceful error handling with retry options
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Smooth loading animations and states

## Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard (copy from `.env.local`)
4. Deploy!

## Firebase Console

Access your Firebase project at: https://console.firebase.google.com/project/lionbit-test

- **Realtime Database**: View and edit data at https://console.firebase.google.com/project/lionbit-test/database
- **Analytics**: Monitor usage at https://console.firebase.google.com/project/lionbit-test/analytics

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Tailwind CSS](https://tailwindcss.com/docs)
