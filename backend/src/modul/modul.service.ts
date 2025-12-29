import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateModulDto } from './dto/create-modul.dto';

@Injectable()
export class ModulService{
    constructor(private readonly firebaseService: FirebaseService) {}
    
    async findModulByPraktikumId(praktikumId: number): Promise<any> {
        const firestore = this.firebaseService.getFirestore();
        if (!firestore) throw new NotFoundException('Firestore not initialized');

        const col = firestore.collection('modul');
        const q = await col.where('praktikumId', '==', praktikumId).get();
        if (q.empty) throw new NotFoundException(`Modul dari praktikumId=${praktikumId} masih kosong`);

        const docs = q.docs;

        if (docs.length > 1) {
            return docs.map((doc) => {
                const data = doc.data() || {} as any;
                return {
                    id: data.id ?? doc.id ?? null,
                    judul: data.judul ?? null,
                    deskripsi: data.deskripsi ?? null,
                    status: data.status ?? 'locked',
                };
            });
        } else {
            const data = docs[0].data() || {} as any;
            return {
                id: data.id ?? docs[0].id ?? null,
                judul: data.judul ?? null,
                deskripsi: data.deskripsi ?? null,
                status: data.status ?? 'locked',
            };
        }
    }

    async createModul(createModulDto: CreateModulDto) {
        const firestore = this.firebaseService.getFirestore();

        if (!firestore) {
            throw new InternalServerErrorException('Firestore not initialized');
        }

        const modulCollection = firestore.collection('modul');

        let docRef: any;
        if (createModulDto.id) {
            docRef = modulCollection.doc(String(createModulDto.id));
            await docRef.set({ ...createModulDto });
        } else {
            docRef = await modulCollection.add({ ...createModulDto });
            await docRef.update({ id: docRef.id }).catch(() => {});
        }

        const result = {
            id: (createModulDto.id ?? docRef.id) as any,
            judul: createModulDto.judul ?? null,
            deskripsi: createModulDto.deskripsi ?? null,
            tujuan: createModulDto.tujuan ?? null,
            dasarTeori: createModulDto.dasarTeori ?? null,
            alatBahan: createModulDto.alatBahan ?? null,
            prosedur: createModulDto.prosedur ?? null,
        };

        return result;
    }

    async findDetailModul(id: number): Promise<any>{
        const firestore = this.firebaseService.getFirestore();
        if (!firestore) throw new NotFoundException('Firestore not initialized');

        const col = firestore.collection('modul');
        const q = await col.where('id', '==', id).limit(1).get();
        if (q.empty) throw new NotFoundException(`Modul dengan id=${id} tidak ditemukan`);

        const data = q.docs[0].data()
        
        return {
            id: data.id ?? id,
            judul: data.judul ?? null,
            deskripsi: data.deskripsi ?? null,
            tujuan: data.tujuan ?? null,
            dasarTeori: data.dasarTeori ?? null,
            alatBahan: data.alatBahan ?? null,
            prosedur: data.prosedur ?? null,
            status: data.status ?? 'locked',
        };
    }
}