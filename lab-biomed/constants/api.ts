// API configuration
// Untuk web: gunakan localhost
// Untuk mobile (HP): ganti dengan IP Mac kamu (cek dengan: ipconfig getifaddr en0)
//export const API_URL = 'http://172.20.10.4:3000/api'; // Backend NestJS local
export const API_URL = 'https://lab-biomed-mobile-production.up.railway.app/api'; // Backend NestJS Railway

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/users/profile',
  PEMINJAMAN: '/peminjaman',
  PEMINJAMAN_BY_DATE: (date: string) => `/peminjaman/date/${date}`,
  PEMINJAMAN_SLOTS: (date: string) => `/peminjaman/slots/${date}`,
  PEMINJAMAN_STATUS: (id: string) => `/peminjaman/${id}/status`,
  PEMINJAMAN_CANCEL: (id: string) => `/peminjaman/${id}/cancel`,
  // Add more endpoints as needed
};
