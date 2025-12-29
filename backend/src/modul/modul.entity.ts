import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TugasAwal } from '../tugas-awal/tugas-awal.entity';
import { Presensi } from '../presensi/presensi.entity';

@Entity('modul')
export class Modul {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column ({ type: 'int'})
    praktikumId: number;
    
    @Column({ type: 'text'})
    judul: string;

    @Column ({ type: 'text'})
    deskripsi: string;

    @Column ({ type: 'text'})
    tujuan: string;

    @Column ({ type: 'text'})
    dasarTeori: string;

    @Column ({ type: 'text'})
    alatBahan: string;

    @Column ({ type: 'text'})
    prosedur: string;

    @OneToMany(() => TugasAwal, (t) => t.modul)
    tugasAwal: TugasAwal[];

    @OneToMany(() => Presensi, (p) => p.modulRef)
    presensi: Presensi[];
}