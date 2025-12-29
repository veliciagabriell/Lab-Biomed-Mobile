import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateModulDto {
    @ApiProperty({ example: 1})
    @IsNotEmpty({ message: 'id modul tidak boleh kosong' })
    id: number;

    @ApiProperty({ example: 1})
    @IsNotEmpty({ message: 'id praktikum tidak boleh kosong' })
    praktikumId: number;

    @ApiProperty({ example: 'Sistem Kendali'})
    @IsNotEmpty({ message: 'Judul praktikum tidak boleh kosong' })
    judul: string;

    @ApiProperty({ example: 'Modul Sistem Kendali membahas prinsip dan metode pengendalian sistem agar bekerja stabil, akurat, dan sesuai tujuan.' })
    @IsOptional()
    @IsString()
    deskripsi: string;

    @ApiProperty({ example: 'Tujuan praktikum ini adalah agar mahasiswa mampu menganalisis, merancang, dan menguji sistem kendali sederhana secara praktis.' })
    @IsOptional()
    @IsString()
    tujuan: string;

    @ApiProperty({ example: 'Sistem kendali mempelajari cara mengatur perilaku suatu sistem agar menghasilkan keluaran yang diinginkan melalui mekanisme pengendalian dan umpan balik. Dasar teori modul ini mencakup pemodelan sistem, analisis kestabilan, serta respon sistem terhadap masukan.' })
    @IsOptional()
    @IsString()
    dasarTeori: string;

    @ApiProperty({ example: '1. Laptop atau komputer\n2. Software simulasi (misalnya MATLAB/Simulink)\n3. Power supply\n4. Komponen elektronika pendukung (sensor, aktuator, kabel penghubung)\n5. Alat ukur (multimeter atau osiloskop)' })
    @IsOptional()
    @IsString()
    alatBahan: string;

    @ApiProperty({ example: '1. Mempelajari teori dasar sistem kendali dan tujuan praktikum\n2. Menyiapkan alat dan bahan yang akan digunakan\n3. Merangkai sistem kendali sesuai dengan modul praktikum\n4. Mengatur parameter sistem dan menjalankan percobaan\n5. Mengamati dan mencatat respon sistem terhadap masukan\n6. Menganalisis hasil percobaan dan menarik kesimpulan' })
    @IsOptional()
    @IsString()
    prosedur: string;
}