import { Entity, Index, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Modul } from '../modul/modul.entity';

@Entity('Presensi')
export class Presensi {
    @Index({ unique: true })
    @Column({ unique: true, length: 8})
    nim: string;

    @Column ({ type: 'varchar', length: 200})
    nama: string;

    @Column ({ type: 'int' })
    kelompok: number;

    @Column({ name: 'modul_id', type: 'int', nullable: true})
    modulId?: number;

    @ManyToOne(() => Modul, (m) => m.presensi, {onDelete: 'SET NULL'})
    @JoinColumn ({ name: 'modul_id'})
    modulRef?: Modul;
}