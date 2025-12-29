import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class PraktikumService {
    constructor(private readonly firebaseService: FirebaseService) {}

    async findOnePrak(id: number): Promise<any> {
        const firestore = this.firebaseService.getFirestore();
        if (!firestore) throw new NotFoundException('Firestore not initialized');

        const col = firestore.collection('praktikum');
        const q = await col.where('id', '==', id).limit(1).get();
        if (q.empty) throw new NotFoundException(`Praktikum with id=${id} not found`);

        const data = q.docs[0].data() || {};
        return {
            id: data.id ?? id,
            namaHalaman: data.namaHalaman ?? null,
            deskripsi: data.deskripsi ?? null,
        };
    }
}