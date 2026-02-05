# 📝 Smart Tasks - Cloud-Powered Task Manager


<<<<<<< HEAD

A modern, premium task management application featuring Google Authentication, real-time cloud synchronization, and a stunning glassmorphism UI inspired by contemporary design trends.
=======
![Tasks App](https://img.shields.io/badge/React-18.3-blue?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-11.1-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

A modern task management application with Google Authentication, real-time cloud synchronization, and a premium glassmorphism UI.

[Live Demo](#) • [Report Bug](https://github.com/ayushagnihotrii/smart-tasks-app/issues) • [Request Feature](https://github.com/ayushagnihotrii/smart-tasks-app/issues)

</div>
>>>>>>> 37ebdda (docs: Simplify README for better clarity and professionalism)

---

## ✨ Features

- **🔐 Google Authentication** - Secure sign-in with Firebase Auth
- **☁️ Real-Time Sync** - Tasks sync instantly across all devices
- **📋 Task Management** - Create, edit, complete, and star tasks
- **⏰ Smart Notifications** - Get alerts 1 hour before deadlines
- **🎨 Premium UI** - Glassmorphism design with smooth animations
- **📱 Responsive** - Works seamlessly on mobile, tablet, and desktop

---

<<<<<<< HEAD
=======
## 🖼️ Screenshots

### Login Screen
![Login Page](https://via.placeholder.com/800x450/0a0a0f/667eea?text=Login+Screen)

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/0a0a0f/667eea?text=Task+Dashboard)

---
>>>>>>> 37ebdda (docs: Simplify README for better clarity and professionalism)

## 🛠️ Tech Stack

**Frontend**
- React 18.3 - UI library
- Vite 6.0 - Build tool
- Tailwind CSS 3.4 - Styling
- Lucide React - Icons

**Backend**
- Firebase Authentication - User auth
- Firebase Firestore - Database
- Real-time listeners - Live sync

**Design**
- Glassmorphism effects
- Dark gradient backgrounds
- Custom animations
- Playfair Display + Inter fonts

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushagnihotrii/smart-tasks-app.git
   cd smart-tasks-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Google Authentication
   - Create Firestore database
   - Copy your config to `src/config/firebase.js`
   
   See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:5173`

---

## 📁 Project Structure

```
smart-tasks-app/
├── src/
│   ├── components/       # React components
│   ├── contexts/         # Auth context
│   ├── services/         # Firestore services
│   ├── config/           # Firebase config
│   └── App.jsx           # Main app
├── public/               # Static assets
└── README.md
```

---

## 🎯 How It Works

1. **Sign In** - Click "Continue with Google"
2. **View Tasks** - See all your tasks in a beautiful interface
3. **Add Tasks** - Create tasks with titles, descriptions, dates, and times
4. **Manage** - Complete, star, or edit tasks
5. **Sync** - Changes sync automatically across all devices

---

## 🔒 Security

All data is user-scoped with Firestore security rules:
- Users can only read/write their own tasks
- Authentication required for all operations
- Data isolated by user ID

---

## 🚀 Deployment

**Build for production**
```bash
npm run build
```

**Deploy to Vercel/Netlify**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

**Ayush Agnihotri**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/ayushagnihotrii)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/ayushagnihotrii)

---

<<<<<<< HEAD

---

**Built with ❤️ using React, Firebase, and Tailwind CSS**
=======
## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [React](https://react.dev/) - UI framework

---

<div align="center">

**Built with ❤️ using React, Firebase, and Tailwind CSS**

⭐ Star this repo if you find it helpful!

</div>
>>>>>>> 37ebdda (docs: Simplify README for better clarity and professionalism)
