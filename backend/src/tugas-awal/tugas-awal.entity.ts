import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Modul } from '../modul/modul.entity';

@Entity('tugas-awal')
export class TugasAwal {
    @PrimaryGeneratedColumn('increment')
    submissionId: number;

    @Column({ type: 'text'})
    nama: string;

    @Column({ length: 8 })
    nim: string;

    @Column({ type: 'text'})
    submission_url: string;

    @Column({ type: 'text'})
    tugas_url: string;

    @Column({ name: 'modul_id', nullable: true })
    modulId?: number;

    @ManyToOne(() => Modul, (modul) => modul.tugasAwal, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'modul_id' })
    modulRef?: Modul;
}