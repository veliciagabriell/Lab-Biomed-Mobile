export enum StatusPeminjaman {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled'
}

export interface Peminjaman {
    id: string;
    userId: string; // ID user yang meminjam
    userEmail: string;
    userName: string;
    userNim: string;
    tanggal: string; // Format: YYYY-MM-DD
    waktuMulai: string; // Format: HH:mm
    waktuSelesai: string; // Format: HH:mm
    jumlahOrang: number;
    keperluan: string;
    status: StatusPeminjaman;
    approvedBy?: string; // ID asisten yang approve
    approvedAt?: string; // Timestamp approval
    rejectedReason?: string; // Alasan reject
    createdAt: string;
    updatedAt: string;
}
