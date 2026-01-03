# Setup Guide - Lab Biomed Mobile

Panduan untuk menjalankan aplikasi Lab Biomed Mobile di laptop lokal.

## Prerequisites

- Node.js (v18 atau lebih baru)
- npm atau yarn
- Expo CLI
- Expo Go app di HP (untuk testing mobile)
- Firebase project dengan Firestore dan Authentication

---

## 🔧 Setup Backend

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Firebase
- Pastikan file `firebase-service-account.json` sudah ada di folder `backend/`
- File ini berisi credentials Firebase project kamu
- **JANGAN** push file ini ke git (sudah ada di .gitignore)

### 3. Jalankan Backend
```bash
npm run start:dev
```

Backend akan berjalan di `http://localhost:3000`

### 4. Cek IP Address Laptop Kamu
Untuk testing di HP (physical device), kamu perlu tahu IP address laptop:

**MacOS:**
```bash
ipconfig getifaddr en0
# Atau jika pakai Wi-Fi:
ipconfig getifaddr en1
```

**Windows:**
```bash
ipconfig
# Cari "IPv4 Address" di bagian Wi-Fi atau Ethernet
```

**Linux:**
```bash
hostname -I
# Atau:
ip addr show
```

Contoh hasil: `192.168.1.100`

---

## 📱 Setup Frontend (Mobile App)

### 1. Install Dependencies
```bash
cd lab-biomed
npm install
```

### 2. **PENTING:** Ubah API URL
Buka file `lab-biomed/constants/api.ts` dan ganti IP address dengan IP laptop kamu:

```typescript
// Ganti IP ini dengan IP laptop kamu
export const API_URL = 'http://192.168.1.100:3000/api';
//                            ^^^^^^^^^^^^^^
//                            IP laptop kamu
```

**Catatan:**
- Jika testing di **emulator/simulator**: pakai `http://localhost:3000/api` (iOS) atau `http://10.0.2.2:3000/api` (Android)
- Jika testing di **HP fisik**: pakai IP laptop (contoh: `http://192.168.1.100:3000/api`)
- **PASTIKAN** laptop dan HP terhubung ke Wi-Fi yang sama!

### 3. Jalankan Expo
```bash
npm start
```

### 4. Scan QR Code
- Buka Expo Go app di HP kamu
- Scan QR code yang muncul di terminal
- Atau tekan `i` untuk iOS simulator, `a` untuk Android emulator

---

## 🔥 Setup Firebase (Jika Belum Ada)

### 1. Buat Firebase Project
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project"
3. Ikuti langkah-langkah setup

### 2. Enable Authentication
1. Di Firebase Console, buka **Authentication**
2. Klik tab **Sign-in method**
3. Enable **Email/Password**

### 3. Enable Firestore
1. Buka **Firestore Database**
2. Klik **Create database**
3. Pilih **Start in test mode** (untuk development)
4. Pilih lokasi server (asia-southeast1 untuk Indonesia)

### 4. Download Service Account Key
1. Buka **Project Settings** (icon gear)
2. Tab **Service accounts**
3. Klik **Generate new private key**
4. Save file sebagai `firebase-service-account.json` di folder `backend/`

### 5. Setup Firebase Config untuk Mobile App
1. Di Firebase Console, tambah iOS/Android app
2. Download `google-services.json` (Android) atau `GoogleService-Info.plist` (iOS)
3. Copy Web config, lalu buka `lab-biomed/config/firebase.ts`
4. Paste config kamu di file tersebut

---

## 📝 Checklist Setup

- [ ] Backend dependencies installed (`npm install` di folder backend)
- [ ] Firebase service account key sudah ada di `backend/firebase-service-account.json`
- [ ] Backend running (`npm run start:dev` di folder backend)
- [ ] Tahu IP address laptop (`ipconfig getifaddr en0` atau `ipconfig`)
- [ ] Frontend dependencies installed (`npm install` di folder lab-biomed)
- [ ] **API URL sudah diubah** di `lab-biomed/constants/api.ts`
- [ ] Laptop dan HP terhubung ke Wi-Fi yang sama
- [ ] Expo running (`npm start` di folder lab-biomed)
- [ ] App sudah bisa dibuka di HP via Expo Go

---

## 🚨 Troubleshooting

### Backend tidak bisa diakses dari HP
- ✅ Pastikan laptop dan HP di Wi-Fi yang sama
- ✅ Cek firewall laptop tidak memblokir port 3000
- ✅ Test dulu di browser HP: buka `http://[IP-LAPTOP]:3000/api/docs`
- ✅ Pastikan IP address di `api.ts` sudah benar

### Error "Network request failed"
- ✅ Backend belum jalan? Cek terminal backend
- ✅ IP address salah? Coba cek ulang dengan `ipconfig getifaddr en0`
- ✅ Ganti `http` jadi `https`? Jangan! Pakai `http` untuk local development

### Firebase error
- ✅ Pastikan `firebase-service-account.json` ada dan valid
- ✅ Cek Firebase Firestore sudah enabled
- ✅ Cek Firebase Authentication sudah enabled (Email/Password)

### Port 3000 sudah dipakai
Ubah port di `backend/src/main.ts`:
```typescript
await app.listen(3001); // Ganti ke port lain
```
Jangan lupa ubah juga di `api.ts`:
```typescript
export const API_URL = 'http://192.168.1.100:3001/api';
```

---

## 🎯 Testing

### Test Backend API
Buka browser: `http://localhost:3000/api/docs`

Kamu akan lihat Swagger API documentation dengan semua endpoints:
- `/api/auth/login`
- `/api/auth/register`
- `/api/modul`
- `/api/peminjaman`
- `/api/peminjaman-alat`
- dll.

### Test Login
1. Buka app di HP
2. Klik "Register" di halaman login
3. Buat akun baru (role: praktikan atau asisten)
4. Login dengan akun yang baru dibuat
5. Coba fitur-fitur:
   - Tab Praktikum: lihat list modul
   - Tab Peminjaman: peminjaman lab atau alat
   - Tab Explore: lihat profil

---

## 📁 Struktur Project

```
Lab-Biomed-Mobile/
├── backend/               # NestJS Backend
│   ├── src/
│   ├── firebase/
│   ├── firebase-service-account.json  # ⚠️ JANGAN push ke git!
│   └── package.json
├── lab-biomed/           # React Native Mobile App
│   ├── app/              # Screens (expo-router)
│   ├── components/       # Reusable components
│   ├── constants/        # Config & constants
│   │   └── api.ts        # ⚠️ UBAH IP ADDRESS DI SINI
│   ├── contexts/         # React contexts
│   ├── config/           # Firebase config
│   └── package.json
└── SETUP.md              # File ini
```

---

## 🔐 Security Notes

**File yang JANGAN di-push ke git:**
- `backend/firebase-service-account.json`
- `lab-biomed/google-services.json`
- `lab-biomed/GoogleService-Info.plist`
- File `.env` jika ada

**File yang HARUS diubah setiap orang:**
- `lab-biomed/constants/api.ts` - sesuaikan dengan IP laptop masing-masing

---

## 💡 Tips

1. **Gunakan IP Static** (opsional tapi recommended):
   - Set IP static di router Wi-Fi untuk laptop development
   - Jadi tidak perlu ganti-ganti IP di `api.ts`

2. **Gunakan ngrok** untuk expose backend ke internet (opsional):
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```
   Ganti API_URL dengan URL ngrok yang dikasih

3. **Development di Laptop yang Sama**:
   Jika develop di laptop yang sama (tidak testing di HP fisik):
   - Backend: `http://localhost:3000/api`
   - iOS Simulator: `http://localhost:3000/api`
   - Android Emulator: `http://10.0.2.2:3000/api`

---

## 📞 Need Help?

Jika ada masalah, cek:
1. Terminal backend - ada error messages?
2. Terminal expo - ada error messages?
3. Browser di HP - buka `http://[IP-LAPTOP]:3000/api/docs` bisa diakses?
4. Sudah yakin IP address benar?

Good luck! 🚀
