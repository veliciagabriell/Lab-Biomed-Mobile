import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('praktikum')
export class Praktikum {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    namaHalaman: string;

    @Column({ type: 'text'})
    deskripsi: string;
}