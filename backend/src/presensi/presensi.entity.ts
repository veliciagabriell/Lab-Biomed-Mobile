import { Entity, Index, Column } from 'typeorm';

@Entity('Presensi')
export class Presensi {
    @Index({ unique: true })
    @Column({ unique: true, length: 8})
    nim: string;

    @Column ({ type: 'varchar', length: 200})
    nama: string;

    @Column ({ type: 'int' })
    kelompok: number;

    @Column ({ type: 'text' })
    modul: string;
}