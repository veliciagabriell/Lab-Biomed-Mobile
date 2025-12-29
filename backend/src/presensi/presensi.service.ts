import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { PresensiDto } from './dto/presensi.dto';

@Injectable()
export class PresensiService{
    constructor(private readonly firebaseService: FirebaseService) {}

    async getPresensiByNim(nim?: string): Promise<any[]> {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');

        const col = firestore.collection('presensi');
        const q = await col.get();
        const docs = q.docs || [];

        const map = docs.map((doc) => {
            const data = doc.data() || {} as any;
            return {
                nim: data.nim ?? null,
                nama: data.nama ?? null,
                kelompok: data.kelompok ?? null,
                modul: data.modul ?? null,
                _id: doc.id,
            };
        });

        if (nim) {
            return map.filter((m) => String(m.nim) === String(nim));
        }

        return map;
    }

    async getAllPresensi() {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');

        const col = firestore.collection('presensi');
        const q = await col.get();
        
        const docs = q.docs || {};

        if (docs.length > 1) {
            return docs.map((doc) => {
                const data = doc.data() || {} as any;
                return {
                    nim: data.nim ?? null,
                    nama: data.nama ?? null,
                    kelompok: data.kelompok ?? null,
                    modul: data.modul ?? null,
                };
            });
        } else {
            const data = docs[0].data() || {} as any;
            return {
                nim: data.nim ?? null,
                nama: data.nama ?? null,
                kelompok: data.kelompok ?? null,
                modul: data.modul ?? null,
            };
        }
    }

    async sendPresensi(presensiDto: PresensiDto) {
        const firestore = this.firebaseService.getFirestore();

        if (!firestore) {
            throw new InternalServerErrorException('Firestore not initialized');
        }
        
        const presensiCollection = firestore.collection('presensi');

        let docRef: any;

        docRef = presensiCollection.doc(String(presensiDto.nim));
        await docRef.set({ ...presensiDto });

        const result = {
            nim: presensiDto.nim ?? docRef.nim,
            nama: presensiDto.nama ?? null,
            kelompok: presensiDto.kelompok ?? null,
            modul: presensiDto.modul ?? null,
        };

        return result
    }
}