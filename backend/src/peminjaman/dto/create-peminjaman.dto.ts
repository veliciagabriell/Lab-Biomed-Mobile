import { IsString, IsNotEmpty, IsNumber, IsDateString, Matches, Min } from 'class-validator';

export class CreatePeminjamanDto {
    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    userNim: string;

    @IsDateString()
    @IsNotEmpty()
    tanggal: string; // Format: YYYY-MM-DD

    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Waktu mulai harus dalam format HH:mm'
    })
    waktuMulai: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Waktu selesai harus dalam format HH:mm'
    })
    waktuSelesai: string;

    @IsNumber()
    @Min(1)
    jumlahOrang: number;

    @IsString()
    @IsNotEmpty()
    keperluan: string;
}
