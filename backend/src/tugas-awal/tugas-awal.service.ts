import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { SubmiTugasDto } from './dto/submit-tugas-awal.dto';

@Injectable()
export class TugasAwalService {
    constructor(private readonly firebaseService: FirebaseService) {}

    async submitTugasAwal(modulId: number, submitDto: SubmiTugasDto) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new Error('Firestore not initialized');
        }

        const tugasAwalCollection = firestore.collection('tugas-awal');

        // Check if already submitted
        const existing = await tugasAwalCollection
            .where('modulId', '==', modulId)
            .where('nim', '==', submitDto.nim)
            .get();

        if (!existing.empty) {
            // Update existing submission
            const docId = existing.docs[0].id;
            await tugasAwalCollection.doc(docId).update({
                submission_url: submitDto.submission_url,
                updatedAt: new Date(),
            });

            return {
                id: docId,
                modulId,
                ...submitDto,
                updatedAt: new Date(),
            };
        }

        // Create new submission
        const newSubmission = {
            modulId,
            nama: submitDto.nama,
            nim: submitDto.nim,
            submission_url: submitDto.submission_url,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const docRef = await tugasAwalCollection.add(newSubmission);

        return {
            id: docRef.id,
            ...newSubmission,
        };
    }

    async findByModulAndNim(modulId: number, nim: string) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new Error('Firestore not initialized');
        }

        const tugasAwalCollection = firestore.collection('tugas-awal');
        const snapshot = await tugasAwalCollection
            .where('modulId', '==', modulId)
            .where('nim', '==', nim)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
        };
    }

    async findByModul(modulId: number) {
        const firestore = this.firebaseService.getFirestore();
        
        if (!firestore) {
            throw new Error('Firestore not initialized');
        }

        const tugasAwalCollection = firestore.collection('tugas-awal');
        const snapshot = await tugasAwalCollection
            .where('modulId', '==', modulId)
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}
