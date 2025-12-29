import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTugasDto {
    @ApiProperty({ example: 'https://storage.example.com/books/math.pdf'})
    @IsNotEmpty()
    @IsString()
    tugas_url: string;
}