import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Index({ unique: true })
    @Column({ unique: true, length: 255 })
    email: string;

    @Exclude()
    @Column({ name: 'hashPassword', length: 255 })
    hashPassword: string;

    @Index({ unique: true })
    @Column({ unique: true, length: 50 })
    nim: string;

    @Column({ type: 'varchar', length: 50, default: 'PRAKTIKAN' })
    role: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}