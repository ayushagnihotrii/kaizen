# Firebase Setup Guide

## 🔥 Quick Setup Instructions

Your Google Tasks clone is now ready for Firebase! Follow these steps to activate authentication and cloud sync:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard (you can disable Google Analytics if you want)

### Step 2: Enable Google Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Add your support email
5. Click **Save**

### Step 3: Create Firestore Database

1. Go to **Firestore Database** in the sidebar
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules next)
4. Select a location (choose closest to your users)
5. Click **Enable**

### Step 4: Add Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      // Allow users to read only their own tasks
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      
      // Allow users to create tasks with their own userId
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Allow users to update/delete only their own tasks
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

### Step 5: Get Your Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to **Your apps**
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (give it a name like "Tasks App")
5. Copy the `firebaseConfig` object

### Step 6: Add Config to Your App

1. Open `src/config/firebase.js` in your project
2. Replace the placeholder config with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 7: Configure Authorized Domains (for Production)

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain (e.g., `yourdomain.com`)
3. `localhost` is already authorized for development

### Step 8: Test Your App

1. Make sure your dev server is running: `npm run dev`
2. Open your browser to `http://localhost:5177`
3. You should see the login page
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should see your tasks dashboard!

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Google Authentication enabled
- [ ] Firestore database created
- [ ] Security rules added
- [ ] Firebase config added to `src/config/firebase.js`
- [ ] App shows login page when not authenticated
- [ ] Google login works successfully
- [ ] Tasks can be added and appear in real-time
- [ ] Tasks persist after page refresh
- [ ] Logout works correctly
- [ ] Different users see different tasks (test with 2 Google accounts)

## 🔒 Security Notes

- The Firestore security rules ensure users can only access their own tasks
- Each task document includes a `userId` field that matches the authenticated user's UID
- All database queries are automatically scoped to the current user

## 🐛 Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Authorized domains in Firebase Authentication settings

### "Missing or insufficient permissions"
- Check that your Firestore security rules are published correctly
- Ensure you're signed in

### Tasks not appearing
- Check browser console for errors
- Verify your Firebase config is correct
- Ensure Firestore database is created and rules are set

### Login popup blocked
- Allow popups for localhost in your browser settings
- Try using a different browser

## 📱 Next Steps

Once Firebase is configured:
- All your tasks will sync across devices in real-time
- You can access your tasks from any device by logging in
- Tasks are securely stored in the cloud
- Notifications will work with cloud-synced tasks
- Edit functionality works with Firestore updates

Enjoy your cloud-powered task manager! 🎉
