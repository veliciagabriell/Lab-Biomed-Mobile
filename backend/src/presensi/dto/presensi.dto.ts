import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class PresensiDto {
    @ApiProperty({ example: 'Praktikan 1'})
    @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
    @IsString()
    nama: string;

    @ApiProperty({ example: '18223085' })
    @IsNotEmpty({ message: 'NIM tidak boleh kosong' })
    @IsString()
    nim: string;

    @ApiProperty({ example: '8'})
    @IsNotEmpty({ message: 'Nomor kelompok tidak boleh kosong'})
    @IsNumber()
    kelompok: number;

    @ApiProperty({ example: 'Praktikum X' })
    @IsNotEmpty({ message: 'Namsa modul praktikum tidak boleh kosong '})
    @IsString()
    modul: string;
}