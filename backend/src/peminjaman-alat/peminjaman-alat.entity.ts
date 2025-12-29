export interface PeminjamanAlat {
  id?: string;
  alatId: number;
  namaAlat: string;
  namaLengkap: string;
  nim: string;
  jumlah: number;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  status: StatusPeminjamanAlat;
  rejectedReason?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum StatusPeminjamanAlat {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
