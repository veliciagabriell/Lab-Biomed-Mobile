import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';
import { CreateTugasDto } from './dto/create-tugas-awal.dto';
import { SubmitTugasDto } from './dto/submit-tugas-awal.dto';

@Injectable()
export class TugasAwalService{
    constructor(private readonly firebaseService: FirebaseService) {}

    // praktikan
    // get dokumen tugas awalnya
    async getTugasAwal(modulId?: number): Promise<any> {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');
        const col = firestore.collection('doc-tugas-awal');
        const q = (modulId !== undefined && modulId !== null)
            ? await col.where('modulId', '==', modulId).get()
            : await col.get();

        const docs = q.docs || [];

        return docs.map((doc) => {
            const data = (doc.data() || {}) as any;
            return {
                tugas_url: data.tugas_url ?? null,
                modulId: data.modulId ?? null,
            };
        });
    }

    // post untuk kumpul tugas 
    async submitTugas(submitTugasDto: SubmitTugasDto) {
        const firestore = this.firebaseService.getFirestore();

        if (!firestore) {
            throw new InternalServerErrorException('Firestore not initialized');
        }
        const submissionTugasCollection = firestore.collection('submission-tugas-awal');
        const docRef = submissionTugasCollection.doc(String(submitTugasDto.nim));
        await docRef.set({ ...submitTugasDto });

        return {
            submissionId: submitTugasDto.submissionId ?? null,
            nim: submitTugasDto.nim ?? null,
            nama: submitTugasDto.nama ?? null,
            submission_url: submitTugasDto.submission_url ?? null,
            nilai: submitTugasDto.nilai ?? null,
        };
    }

    // asisten
    // get submission tugas awal per modul
    async getSubmission(modulId?: number): Promise<any[]> {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');
        const col = firestore.collection('submission-tugas-awal');
        const q = (modulId !== undefined && modulId !== null)
            ? await col.where('modulId', '==', modulId).get()
            : await col.get();

        const docs = q.docs || [];

        return docs.map((doc) => {
            const data = (doc.data() || {}) as any;
            return {
                submissionId: data.submissionId ?? null,
                nim: data.nim ?? null,
                nama: data.nama ?? null,
                submission_url: data.submission_url ?? null,
                nilai: data.nilai ?? null,
            };
        });
    }

    //post tugas
    async uploadTugas(createTugasDto: CreateTugasDto) {
        const firestore = this.firebaseService.getFirestore();

        if (!firestore) {
            throw new InternalServerErrorException('Firestore not initialized');
        }
        const createTugasCollection = firestore.collection('doc-tugas-awal');
        const docRef = createTugasCollection.doc(); 
        await docRef.set({ ...createTugasDto, tugasId: docRef.id });

        return {
            tugas_url: createTugasDto.tugas_url ?? null,
            tugasId: docRef.id,
        };
    }

    // kasih nilai untuk patch nilai
    async giveNilai(submissionId: number, submitTugasDto: SubmitTugasDto): Promise<any> {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');
        const col = firestore.collection('submission-tugas-awal');

        const q = await col.where('submissionId', '==', submissionId).get();

        if (q.empty) {
            throw new NotFoundException('Belum ada submission dengan Id itu');
        }

        if (submitTugasDto.nilai !== undefined && (submitTugasDto.nilai < 0 || submitTugasDto.nilai > 100)) {
            throw new BadRequestException('Nilai harus 0-100');
        }

        const doc = q.docs[0];
        const existing = (doc.data() || {}) as any;
        const updated = {
            submissionId: submitTugasDto.submissionId ?? existing.submissionId,
            nim: submitTugasDto.nim ?? existing.nim,
            nama: submitTugasDto.nama ?? existing.nama,
            submission_url: submitTugasDto.submission_url ?? existing.submission_url,
            nilai: submitTugasDto.nilai ?? existing.nilai,
        };

        await doc.ref.update(updated);

        return {
            submissionId: updated.submissionId ?? null,
            nim: updated.nim ?? null,
            nama: updated.nama ?? null,
            submission_url: updated.submission_url ?? null,
            nilai: updated.nilai ?? null,
        };
    }
}