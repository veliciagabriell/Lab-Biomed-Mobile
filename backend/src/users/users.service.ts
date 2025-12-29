import { Injectable, NotFoundException } from "@nestjs/common";
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class UsersService {
    constructor(private readonly firebaseService: FirebaseService) {}

    async findOne(id: number): Promise<any> {
        const firestore = this.firebaseService.getFirestore();
        if (!firestore) throw new NotFoundException('Firestore not initialized');

        const col = firestore.collection('users');
        const q = await col.where('id', '==', id).limit(1).get();
        if (q.empty) throw new NotFoundException(`${id} belum terdaftar`);

        const data = q.docs[0].data() || {};
        return {
            id: data.id ?? id,
            email: data.email ?? null,
            nim: data.nim ?? null,
            role: data.role ?? null,
            createdAt: data.createdAt ?? null,
        };
    }
}