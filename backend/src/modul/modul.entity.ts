import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}