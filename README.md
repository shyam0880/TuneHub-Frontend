# 🎵 TuneHub - Music Streaming Frontend 🎧

[![GitHub](https://img.shields.io/badge/GitHub-TuneHub--Frontend-181717?style=for-the-badge&logo=github)](https://github.com/shyam0880/TuneHub-Frontend)
[![LinkedIn](https://img.shields.io/badge/Connect-Shyam%20Lal%20Kafle-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/shyam0880/)

A modern, responsive frontend application for a music streaming platform, built with **React**. It offers users a seamless music listening experience with playlist management, song downloads, artist browsing, and a centralized music player — all through an intuitive interface.

---

## 🚀 Tech Stack

- ⚛️ **React JS**
- 📦 **React Context API**
- 🌐 **React Router DOM**
- 📋 **React Hook Form**
- ☁️ **Cloudinary (via backend for media uploads)**
- 🔗 **Fetch Api**
- 🧠 **useMemo and useRef hooks**
- 📱 **Bootstrap Icons**

---

## 🎨 Features

- 🎶 Browse, play, and manage songs
- 📁 Create, edit, and delete playlists
- 🔍 Search functionality for songs based on name and artist
- ⬇️ Download songs and manage downloaded tracks locally
- 🎭 Artist listing and filtering
- 🔄 Autoplay and repeat modes
- 🎛️ Centralized, global music player control using React Context API
- 📝 Keep track of recently played songs for quick access
- 🧭 Seamless transition to a mini player for continuous playback
- 🧠 Used `useMemo` to memoize expensive computations and avoid unnecessary renders  
- 📌 Leveraged `useRef` for direct DOM manipulation and to persist values without causing re-renders  
- 📋 Managed forms efficiently with `React Hook Form` for easy validation and cleaner code 

---

## 📂 Project Setup & Installation

This project was bootstrapped with **[Vite](https://vitejs.dev/)** — a fast, modern frontend build tool for React projects.

### 🔧 Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**

### 🛠️ Installation Steps

```bash
# Clone the repository
git clone https://github.com/shyam0880/TuneHub-Frontend.git

# Navigate to the project directory
cd TuneHub-Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
## 🗂️ Project Structure

```bash
src/
│
├── components/         # Reusable UI components
      ├── Add Music
      ├── AlertMessage
      ├── Artist
      ├── ConfirmDialog        # Confirm before delete anything
      ├── CreatePlaylist
      ├── DownloadedSongs
      ├── Loading             # Loading effect
      ├── Playlist
      ├── ProfileCard
      ├── Login
      └── Register
├── pages/                  # Different page components (Home, Playlist, Search, etc.)
      ├── Dashboard
      └── Home
├── context/                # React Context for global state management
      ├── AuthContext       # Store user data locally and provide recent song feature
      ├── DataContext       # Store download file locally
      └── ProtectedRouter   # Protect user to enter direct to url
├── Payment/
      └── Payment           # Payment
├── CSS/                    # All css files
      ├── 
      └── .......
├── App.jsx                 # Main application component
├── App.css                 # Global css
└── main.jsx                # Application entry point
```




