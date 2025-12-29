import admin from '../../firebase/firebase';

const modulData = [
  {
    id: 1,
    praktikumId: 1,
    judul: 'Sistem Monitoring Pasien dan Tanda Vital',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Memahami sistem monitoring vital sign pasien menggunakan teknologi sensor biomedis',
    dasarTeori: 'Monitoring pasien mencakup pengukuran tanda vital seperti detak jantung, tekanan darah, suhu tubuh, dan saturasi oksigen. Sistem ini menggunakan berbagai sensor biomedis yang terintegrasi.',
    alatBahan: '1. Pulse oximeter\n2. Blood pressure monitor\n3. Thermometer digital\n4. ECG electrodes\n5. Arduino/Raspberry Pi',
    prosedur: '1. Setup hardware dan sensor\n2. Kalibrasi alat ukur\n3. Pasang elektroda pada pasien\n4. Lakukan pengukuran tanda vital\n5. Analisis data yang diperoleh',
    status: 'done',
  },
  {
    id: 2,
    praktikumId: 1,
    judul: 'Peralatan Bedah Elektrik dan Koagulasi',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Mempelajari prinsip kerja dan penggunaan alat bedah elektrik (electrosurgery) dan sistem koagulasi',
    dasarTeori: 'Bedah elektrik menggunakan arus listrik frekuensi tinggi untuk memotong jaringan dan menghentikan perdarahan (koagulasi). Sistem ini bekerja pada frekuensi 300 kHz - 3 MHz.',
    alatBahan: '1. Electrosurgical unit (ESU)\n2. Active electrode\n3. Return electrode (grounding pad)\n4. Forceps bipolar\n5. Phantom tissue',
    prosedur: '1. Setup ESU dan elektroda\n2. Test output power\n3. Praktik cutting mode\n4. Praktik coagulation mode\n5. Evaluasi hasil',
    status: 'ongoing',
  },
  {
    id: 3,
    praktikumId: 1,
    judul: 'Sistem Ventilator dan Dukungan Hidup',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Memahami cara kerja ventilator mekanik dan sistem dukungan pernapasan pada pasien kritis',
    dasarTeori: 'Ventilator adalah alat yang membantu atau menggantikan fungsi pernapasan pasien. Terdapat berbagai mode ventilasi seperti volume control, pressure control, dan SIMV.',
    alatBahan: '1. Ventilator mekanik\n2. Test lung (paru-paru buatan)\n3. Endotracheal tube\n4. Manometer tekanan\n5. Spirometer',
    prosedur: '1. Setup ventilator\n2. Pengaturan parameter (TV, RR, PEEP)\n3. Tes berbagai mode ventilasi\n4. Monitoring compliance paru\n5. Troubleshooting alarm',
    status: 'locked',
  },
  {
    id: 4,
    praktikumId: 1,
    judul: 'Sistem Ventilator dan Peralatan Respirasi',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Mempelajari peralatan respirasi lanjutan dan terapi oksigen',
    dasarTeori: 'Terapi oksigen mencakup berbagai metode pemberian O2 mulai dari nasal kanul hingga high-flow oxygen therapy. Pemahaman FiO2, flow rate, dan humidifikasi sangat penting.',
    alatBahan: '1. Oxygen concentrator\n2. Nasal kanul\n3. Face mask dengan reservoir\n4. CPAP device\n5. Flow meter dan humidifier',
    prosedur: '1. Setup oxygen delivery system\n2. Kalibrasi flow rate\n3. Tes berbagai interface oksigen\n4. Pengukuran FiO2\n5. Evaluasi efektivitas terapi',
    status: 'locked',
  },
  {
    id: 5,
    praktikumId: 1,
    judul: 'Elektrokardiografi dan Monitoring Jantung',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Memahami prinsip EKG, pemasangan elektroda, dan interpretasi dasar gelombang jantung',
    dasarTeori: 'EKG merekam aktivitas listrik jantung melalui elektroda pada permukaan kulit. Sistem 12-lead memberikan gambaran komprehensif aktivitas elektrikal dari berbagai sudut pandang jantung.',
    alatBahan: '1. ECG machine 12-lead\n2. Elektroda disposable\n3. Gel konduktif\n4. ECG paper\n5. Phantom ECG simulator',
    prosedur: '1. Persiapan pasien/phantom\n2. Pemasangan elektroda 12-lead\n3. Rekam EKG standard\n4. Identifikasi gelombang P-QRS-T\n5. Analisis irama dan kelainan',
    status: 'locked',
  },
  {
    id: 6,
    praktikumId: 1,
    judul: 'Sistem Infus dan Peralatan Terapi',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Mempelajari sistem infus IV, syringe pump, dan peralatan drug delivery',
    dasarTeori: 'Sistem infus modern menggunakan pompa terkomputerisasi untuk memastikan akurasi flow rate dan volume. Terdapat volumetric pump, syringe pump, dan PCA pump.',
    alatBahan: '1. Infusion pump\n2. Syringe pump\n3. IV set dan cairan\n4. Pressure bag\n5. Air detector',
    prosedur: '1. Setup infusion system\n2. Priming IV line\n3. Programming flow rate\n4. Tes alarm dan safety features\n5. Kalibrasi akurasi volume',
    status: 'locked',
  },
  {
    id: 7,
    praktikumId: 1,
    judul: 'Laser Terapi dan Elektroterapi',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Memahami aplikasi laser medis dan elektroterapi dalam fisioterapi dan rehabilitasi',
    dasarTeori: 'Laser terapi menggunakan cahaya monokromatik untuk stimulasi jaringan. Elektroterapi seperti TENS dan IFC menggunakan arus listrik untuk pain relief dan muscle stimulation.',
    alatBahan: '1. Low-level laser therapy device\n2. TENS unit\n3. Interferential current device\n4. Ultrasound therapy\n5. Safety goggles',
    prosedur: '1. Identifikasi area treatment\n2. Setup parameter terapi\n3. Aplikasi laser/elektroterapi\n4. Monitoring respon pasien\n5. Dokumentasi hasil',
    status: 'locked',
  },
  {
    id: 8,
    praktikumId: 1,
    judul: 'Sistem Pencitraan Medis dan Radiologi',
    deskripsi: 'Klik untuk mengakses modul praktikum',
    tujuan: 'Mempelajari dasar-dasar imaging medis termasuk X-ray, CT scan, dan prinsip proteksi radiasi',
    dasarTeori: 'Pencitraan medis menggunakan berbagai modalitas: X-ray (radiografi), CT (computed tomography), MRI (magnetic resonance imaging), dan ultrasound. Masing-masing memiliki prinsip fisika yang berbeda.',
    alatBahan: '1. X-ray machine simulator\n2. Phantom anthropomorphic\n3. Dosimeter\n4. Lead apron\n5. Imaging software',
    prosedur: '1. Setup imaging parameters (kV, mAs)\n2. Positioning phantom\n3. Eksposur dan akuisisi image\n4. Quality control testing\n5. Evaluasi kualitas gambar',
    status: 'locked',
  },
];

async function seedModul() {
  try {
    const firestore = admin.firestore();
    const modulCollection = firestore.collection('modul');

    console.log('Starting modul seeding...');

    for (const modul of modulData) {
      const docRef = modulCollection.doc(String(modul.id));
      await docRef.set(modul);
      console.log(`✓ Seeded modul ${modul.id}: ${modul.judul}`);
    }

    console.log('\n✅ Successfully seeded all 8 modul!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding modul:', error);
    process.exit(1);
  }
}

seedModul();
