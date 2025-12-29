import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanStatusDto } from './dto/update-peminjaman.dto';
import { Peminjaman, StatusPeminjaman } from './peminjaman.entity';
import { Role } from '../auth/role.enum';

@Injectable()
export class PeminjamanService {
    constructor(private firebaseService: FirebaseService) {}

    async create(createDto: CreatePeminjamanDto, userId: string, userEmail: string) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new BadRequestException('Firestore not initialized');
        }
        
        const peminjamanCollection = firestore.collection('peminjaman');

        // Check if time slot is available
        const existingBookings = await peminjamanCollection
            .where('tanggal', '==', createDto.tanggal)
            .where('status', 'in', [StatusPeminjaman.PENDING, StatusPeminjaman.APPROVED])
            .get();

        // Check for time conflicts
        for (const doc of existingBookings.docs) {
            const booking = doc.data();
            if (this.hasTimeConflict(
                createDto.waktuMulai, 
                createDto.waktuSelesai, 
                booking.waktuMulai, 
                booking.waktuSelesai
            )) {
                throw new BadRequestException(
                    `Lab sudah dibooking pada ${createDto.tanggal} jam ${booking.waktuMulai}-${booking.waktuSelesai}`
                );
            }
        }

        // Validate waktu selesai > waktu mulai
        if (createDto.waktuSelesai <= createDto.waktuMulai) {
            throw new BadRequestException('Waktu selesai harus lebih besar dari waktu mulai');
        }

        const newPeminjaman: Omit<Peminjaman, 'id'> = {
            userId,
            userEmail,
            userName: createDto.userName,
            userNim: createDto.userNim,
            tanggal: createDto.tanggal,
            waktuMulai: createDto.waktuMulai,
            waktuSelesai: createDto.waktuSelesai,
            jumlahOrang: createDto.jumlahOrang,
            keperluan: createDto.keperluan,
            status: StatusPeminjaman.PENDING,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const docRef = await peminjamanCollection.add(newPeminjaman);

        return {
            id: docRef.id,
            ...newPeminjaman,
        };
    }

    async findAll(userId?: string, userRole?: string) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new BadRequestException('Firestore not initialized');
        }
        
        const peminjamanCollection = firestore.collection('peminjaman');

        let query: any = peminjamanCollection;

        // Praktikan hanya bisa lihat peminjamannya sendiri
        if (userRole === Role.PRAKTIKAN && userId) {
            query = query.where('userId', '==', userId);
        }

        // No orderBy to avoid composite index - sort in memory instead
        const snapshot = await query.get();

        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Sort in memory by createdAt descending
        results.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
        });

        return results;
    }

    async findOne(id: string) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new BadRequestException('Firestore not initialized');
        }
        
        const doc = await firestore.collection('peminjaman').doc(id).get();

        if (!doc.exists) {
            throw new NotFoundException('Peminjaman tidak ditemukan');
        }

        return {
            id: doc.id,
            ...doc.data(),
        };
    }

    async findByDate(date: string) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new BadRequestException('Firestore not initialized');
        }
        
        const snapshot = await firestore.collection('peminjaman')
            .where('tanggal', '==', date)
            .where('status', 'in', [StatusPeminjaman.PENDING, StatusPeminjaman.APPROVED])
            .orderBy('waktuMulai', 'asc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    async updateStatus(
        id: string, 
        updateDto: UpdatePeminjamanStatusDto, 
        approvedBy: string,
        userRole: string
    ) {
        // Only asisten can approve/reject
        if (userRole !== Role.ASISTEN) {
            throw new ForbiddenException('Hanya asisten yang bisa approve/reject peminjaman');
        }

        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new BadRequestException('Firestore not initialized');
        }
        
        const docRef = firestore.collection('peminjaman').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new NotFoundException('Peminjaman tidak ditemukan');
        }

        const currentData = doc.data();
        
        if (!currentData) {
            throw new NotFoundException('Data peminjaman tidak ditemukan');
        }

        // Validate rejected reason
        if (updateDto.status === StatusPeminjaman.REJECTED && !updateDto.rejectedReason) {
            throw new BadRequestException('Alasan penolakan harus diisi');
        }

        const updateData: any = {
            status: updateDto.status,
            updatedAt: new Date().toISOString(),
        };

        if (updateDto.status === StatusPeminjaman.APPROVED) {
            updateData.approvedBy = approvedBy;
            updateData.approvedAt = new Date().toISOString();
        }

        if (updateDto.status === StatusPeminjaman.REJECTED) {
            updateData.rejectedReason = updateDto.rejectedReason;
        }

        await docRef.update(updateData);

        return {
            id,
            ...currentData,
            ...updateData,
        };
    }

    async cancel(id: string, userId: string) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new BadRequestException('Firestore not initialized');
        }
        
        const docRef = firestore.collection('peminjaman').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new NotFoundException('Peminjaman tidak ditemukan');
        }

        const data = doc.data();
        
        if (!data) {
            throw new NotFoundException('Peminjaman tidak ditemukan');
        }

        // Only owner can cancel
        if (data.userId !== userId) {
            throw new ForbiddenException('Anda tidak bisa membatalkan peminjaman orang lain');
        }

        // Can only cancel if status is pending
        if (data.status !== StatusPeminjaman.PENDING) {
            throw new BadRequestException('Hanya peminjaman dengan status pending yang bisa dibatalkan');
        }

        await docRef.update({
            status: StatusPeminjaman.CANCELLED,
            updatedAt: new Date().toISOString(),
        });

        return {
            id,
            ...data,
            status: StatusPeminjaman.CANCELLED,
        };
    }

    // Helper function to check time conflict
    private hasTimeConflict(
        start1: string, 
        end1: string, 
        start2: string, 
        end2: string
    ): boolean {
        return (start1 < end2) && (end1 > start2);
    }

    // Get available time slots for a date
    async getAvailableSlots(date: string) {
        const bookings = await this.findByDate(date);
        
        // Lab hours: 08:00 - 17:00
        const slots: Array<{startTime: string; endTime: string; available: boolean}> = [];
        for (let hour = 8; hour < 17; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
            
            // Check if this slot is available
            const isBooked = bookings.some((booking: any) => 
                this.hasTimeConflict(startTime, endTime, booking.waktuMulai, booking.waktuSelesai)
            );

            slots.push({
                startTime,
                endTime,
                available: !isBooked,
            });
        }

        return slots;
    }
}
