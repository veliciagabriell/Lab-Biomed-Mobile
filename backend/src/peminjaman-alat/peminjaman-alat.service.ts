import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreatePeminjamanAlatDto } from './dto/create-peminjaman-alat.dto';
import { UpdateStatusPeminjamanAlatDto } from './dto/update-status-peminjaman-alat.dto';
import { StatusPeminjamanAlat } from './peminjaman-alat.entity';

@Injectable()
export class PeminjamanAlatService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createDto: CreatePeminjamanAlatDto, userId: string): Promise<any> {
    const firestore = this.firebaseService.getFirestore();
    if (!firestore) throw new NotFoundException('Firestore not initialized');

    const collection = firestore.collection('peminjaman-alat');
    
    const data = {
      ...createDto,
      userId,
      status: StatusPeminjamanAlat.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await collection.add(data);
    
    return {
      id: docRef.id,
      ...data,
    };
  }

  async findAll(userId?: string, role?: string): Promise<any[]> {
    const firestore = this.firebaseService.getFirestore();
    if (!firestore) throw new NotFoundException('Firestore not initialized');

    const collection = firestore.collection('peminjaman-alat');
    
    let query = collection.orderBy('createdAt', 'desc');
    
    // If praktikan, only show their own bookings
    if (role === 'praktikan' && userId) {
      query = query.where('userId', '==', userId);
    }

    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return [];
    }

    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return results.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }

  async updateStatus(id: string, updateDto: UpdateStatusPeminjamanAlatDto): Promise<any> {
    const firestore = this.firebaseService.getFirestore();
    if (!firestore) throw new NotFoundException('Firestore not initialized');

    const docRef = firestore.collection('peminjaman-alat').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Peminjaman tidak ditemukan');
    }

    const updateData: any = {
      status: updateDto.status,
      updatedAt: new Date().toISOString(),
    };

    if (updateDto.status === 'rejected' && updateDto.rejectedReason) {
      updateData.rejectedReason = updateDto.rejectedReason;
    }

    await docRef.update(updateData);

    return {
      id,
      ...doc.data(),
      ...updateData,
    };
  }
}
