# Lab Biomed Mobile
Aplikasi ini merupakan aplikasi virtual Laboratorium Teknik Biomedika Institut Teknologi Bandung yang berfungsi untuk membantu keberjalanan praktikum, mulai dari peminjaman laboratorium, peminajaman alat, akses modul, pengumpulan dan penilaian tugas awal, serta presensi praktikan. Pada aplikasi ini terdapat 2 aktor yang dapat berperan, yaitu Asisten dan Praktikan. Masing-masing aktor memiliki akses yang berbeda untuk setiap fitur yang ada sehingga dapat menunjang setiap perannya dalam menjalankan kegiatan di laboratorium.

## Kelompok
Made by Kelompok Client - K1:
1. Sendi Putra Alicia (18223063)
2. Velicia Christina Gabriel (18223085)

### Installation
Install .apk pada link [ini](https://drive.google.com/file/d/15MokZyvLlitEgmkjQa3gwpmgp7Ogm7M_/view?usp=sharing) atau scan QR Code pada link [berikut](https://drive.google.com/file/d/1u3UA_GLpVynwEoCxLOCQXqcXd1tCmMUh/view?usp=sharing) melalui aplikasi Expo Go.

## Tech Stack

### Backend
- NestJS
- Firebase (Firestore + Authentication)
- TypeScript
- JWT Authentication
- Swagger API Documentation

### Frontend
- React Native (Expo SDK 54)
- TypeScript
- Ionicons

## Project Structure

```
Lab-Biomed-Mobile/
├── backend/
│   ├── src/
│   │   ├── auth/         
│   │   ├── users/       
│   │   ├── modul/         
│   │   ├── tugas-awal/    
│   │   ├── presensi/      
│   │   ├── peminjaman/    
│   │   └── peminjaman-alat/
│   └── firebase/          
└── lab-biomed/
    ├── app/
    │   ├── (tabs)/       
    │   ├── auth/          
    │   ├── modul/       
    │   └── peminjaman/   
    ├── components/     
    ├── constants/        
    ├── contexts/        
    └── config/          
```
