import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { StatusPeminjaman } from '../peminjaman.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePeminjamanStatusDto {
    @ApiProperty({ example: 'rejected'})
    @IsEnum(StatusPeminjaman)
    @IsNotEmpty()
    status: StatusPeminjaman;

    @ApiProperty({ example: 'kurang bagus'})
    @IsString()
    @IsOptional()
    rejectedReason?: string; // Required jika status = rejected
}
