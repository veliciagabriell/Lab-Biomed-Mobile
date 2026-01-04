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
        try {
            const firestore = this.firebaseService.getFirestore();

            if (!firestore) {
                throw new InternalServerErrorException('Firestore not initialized');
            }
            
            // Validate required fields
            if (!submitTugasDto.modulId) {
                throw new BadRequestException('modulId is required');
            }
            
            if (!submitTugasDto.nim) {
                throw new BadRequestException('nim is required');
            }
            
            console.log('Submitting tugas with data:', JSON.stringify(submitTugasDto, null, 2));
            
            const submissionTugasCollection = firestore.collection('tugas-awal');
            // Use combination of nim and modulId as document ID to prevent duplicates
            const docId = `${submitTugasDto.nim}_${submitTugasDto.modulId}`;
            const docRef = submissionTugasCollection.doc(docId);
            
            // Check if already submitted
            const existingDoc = await docRef.get();
            if (existingDoc.exists) {
                throw new BadRequestException('Tugas awal sudah pernah disubmit. Tidak bisa submit ulang.');
            }
            
            const timestamp = new Date().toISOString();
            
            const submissionData = {
                nim: submitTugasDto.nim,
                nama: submitTugasDto.nama,
                submission_url: submitTugasDto.submission_url,
                nilai: submitTugasDto.nilai ?? null,
                modulId: submitTugasDto.modulId,
                submittedAt: timestamp,
            };
            
            console.log('Saving to Firestore with docId:', docId);
            console.log('Submission data:', JSON.stringify(submissionData, null, 2));
            
            await docRef.set(submissionData);
            
            console.log('Successfully saved to Firestore!');

            return {
                ...submissionData,
                submissionId: docId,
            };
        } catch (error) {
            console.error('Error in submitTugas:', error);
            console.error('Error stack:', error.stack);
            
            // Re-throw BadRequestException as is
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new InternalServerErrorException(`Failed to submit tugas: ${error.message}`);
        }
    }

    // asisten
    // get submission tugas awal per modul
    async getSubmission(modulId?: number): Promise<any[]> {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');
        const col = firestore.collection('tugas-awal');
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
                modulId: data.modulId ?? null,
                submittedAt: data.submittedAt ?? null,
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
    async giveNilai(submissionId: string, submitTugasDto: SubmitTugasDto): Promise<any> {
        const firestore = this.firebaseService.getFirestore()
        if (!firestore) throw new NotFoundException('Firestore not initialized');
        const col = firestore.collection('tugas-awal');

        // submissionId already in format: nim_modulId
        const docRef = col.doc(submissionId);
        const doc = await docRef.get();

        if (!doc.exists) {
            throw new NotFoundException('Submission tidak ditemukan');
        }

        if (submitTugasDto.nilai !== undefined && (submitTugasDto.nilai < 0 || submitTugasDto.nilai > 100)) {
            throw new BadRequestException('Nilai harus 0-100');
        }

        const existing = (doc.data() || {}) as any;
        const updated = {
            nim: existing.nim,
            nama: existing.nama,
            submission_url: existing.submission_url,
            nilai: submitTugasDto.nilai ?? existing.nilai,
            modulId: existing.modulId,
            submittedAt: existing.submittedAt,
        };

        await docRef.update(updated);

        return {
            ...updated,
            submissionId: submissionId,
        };
    }
}