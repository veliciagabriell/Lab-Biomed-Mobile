import { IsNotEmpty, IsString, IsNumber, IsDateString, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeminjamanAlatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  alatId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  namaAlat: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  namaLengkap: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nim: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  jumlah: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  tanggal: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format waktu harus HH:mm' })
  waktuMulai: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Format waktu harus HH:mm' })
  waktuSelesai: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  keperluan: string;
}
