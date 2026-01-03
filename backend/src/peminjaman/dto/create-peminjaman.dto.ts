import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDateString, Matches, Min } from 'class-validator';

export class CreatePeminjamanDto {
    @ApiProperty({ example: 'Sendi Putra Alicia'})
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty({ example: '18223063'})
    @IsString()
    @IsNotEmpty()
    userNim: string;

    @ApiProperty({ example: '2025-12-12'})
    @IsDateString()
    @IsNotEmpty()
    tanggal: string; // Format: YYYY-MM-DD

    @ApiProperty({ example: '10:00'})
    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Waktu mulai harus dalam format HH:mm'
    })
    waktuMulai: string;

    @ApiProperty({ example: '12:00'})
    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Waktu selesai harus dalam format HH:mm'
    })
    waktuSelesai: string;

    @ApiProperty({ example: 1})
    @IsNumber()
    @Min(1)
    jumlahOrang: number;

    @ApiProperty({ example: 'iseng aja'})
    @IsString()
    @IsNotEmpty()
    keperluan: string;
}
