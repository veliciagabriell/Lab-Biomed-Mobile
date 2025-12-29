import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { StatusPeminjaman } from '../peminjaman.entity';

export class UpdatePeminjamanStatusDto {
    @IsEnum(StatusPeminjaman)
    @IsNotEmpty()
    status: StatusPeminjaman;

    @IsString()
    @IsOptional()
    rejectedReason?: string; // Required jika status = rejected
}
