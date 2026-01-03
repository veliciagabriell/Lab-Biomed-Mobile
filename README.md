# Lab Biomed Mobile

Mobile application untuk manajemen praktikum laboratorium biomedical engineering.

## 📋 Features

- **Autentikasi**: Login/Register dengan role (Praktikan/Asisten)
- **Praktikum**: 8 modul praktikum dengan status tracking (done/ongoing/locked)
- **Tugas Awal**: Upload tugas awal untuk setiap modul
- **Presensi**: Submit presensi praktikum per modul
- **Peminjaman Lab**: Booking laboratorium dengan kalender
- **Peminjaman Alat**: Catalog 6 alat lab dengan booking system
- **Dashboard Asisten**: Monitor submission tugas awal dan presensi mahasiswa

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)
- Firebase project

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd Lab-Biomed-Mobile
```

2. **Setup Backend**
```bash
cd backend
npm install

# Tambahkan firebase-service-account.json dari Firebase Console
# (Project Settings > Service accounts > Generate new private key)

npm run start:dev
```

3. **Setup Frontend**
```bash
cd lab-biomed
npm install

# PENTING: Edit constants/api.ts
# Ganti IP address dengan IP laptop kamu
# Cek IP dengan: ipconfig getifaddr en0 (Mac) atau ipconfig (Windows)

npm start
```

4. **Jalankan di HP**
- Install Expo Go dari App Store/Play Store
- Scan QR code dari terminal
- Pastikan HP dan laptop di Wi-Fi yang sama

## 📖 Dokumentasi Lengkap

**Lihat [SETUP.md](./SETUP.md) untuk panduan lengkap setup di laptop baru.**

## 🏗️ Tech Stack

### Backend
- NestJS
- Firebase (Firestore + Authentication)
- TypeScript
- JWT Authentication
- Swagger API Documentation

### Frontend
- React Native (Expo SDK 54)
- TypeScript
- Expo Router (file-based routing)
- React Context API
- Ionicons

## 📁 Project Structure

```
Lab-Biomed-Mobile/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── modul/          # Praktikum modules
│   │   ├── tugas-awal/     # Tugas awal submissions
│   │   ├── presensi/       # Attendance tracking
│   │   ├── peminjaman/     # Lab booking
│   │   └── peminjaman-alat/ # Equipment booking
│   └── firebase/           # Firebase config
└── lab-biomed/
    ├── app/
    │   ├── (tabs)/         # Main tabs (Praktikum, Peminjaman, Explore)
    │   ├── auth/           # Login & Register screens
    │   ├── modul/          # Modul detail & submissions
    │   └── peminjaman/     # Booking screens
    ├── components/         # Reusable components
    ├── constants/          # Config (API URL, theme)
    ├── contexts/           # React contexts (Auth)
    └── config/             # Firebase config
```

## 🔑 Default Credentials

Untuk testing, buat akun baru dengan role:
- **Praktikan**: Untuk submit tugas, presensi, booking
- **Asisten**: Untuk approve/reject booking, monitor submissions

## 🔧 Configuration

### API URL Setup
Edit `lab-biomed/constants/api.ts`:
```typescript
// Ganti dengan IP laptop kamu
export const API_URL = 'http://192.168.1.100:3000/api';
```

Cara cek IP:
- **Mac**: `ipconfig getifaddr en0`
- **Windows**: `ipconfig` (cari IPv4 Address)
- **Linux**: `hostname -I`

### Firebase Setup
1. Buat Firebase project di [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Download service account key → simpan sebagai `backend/firebase-service-account.json`
5. Copy web config → paste di `lab-biomed/config/firebase.ts`

## 🧪 Testing

### API Documentation
Buka browser: `http://localhost:3000/api/docs`

### Test Flow
1. Register akun baru
2. Login dengan akun tersebut
3. Browse modul praktikum
4. Submit tugas awal & presensi
5. Booking lab/alat
6. Login sebagai asisten untuk approve/reject

## 🐛 Troubleshooting

### "Network request failed"
- Cek backend sudah running (`npm run start:dev` di folder backend)
- Cek IP address di `api.ts` sudah benar
- Pastikan HP dan laptop di Wi-Fi yang sama
- Test di browser HP: `http://[IP-LAPTOP]:3000/api/docs`

### Backend Error
- Pastikan `firebase-service-account.json` ada dan valid
- Cek Firebase Firestore sudah enabled
- Cek port 3000 tidak dipakai aplikasi lain

### Expo Error
- Clear cache: `npm start -- --clear`
- Reinstall: `rm -rf node_modules && npm install`
- Update Expo: `npm install expo@latest`

## 📝 TODO

- [ ] Implement Firebase Storage untuk upload file tugas awal
- [ ] Add push notifications untuk status peminjaman
- [ ] Add search/filter di dashboard asisten
- [ ] Export data presensi & submissions ke CSV/Excel
- [ ] Add unit tests

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is for educational purposes.

---

**Need help?** Check [SETUP.md](./SETUP.md) for detailed setup instructions.