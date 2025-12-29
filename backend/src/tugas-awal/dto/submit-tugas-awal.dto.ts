import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmiTugasDto {
    @ApiProperty({ example: 'Praktikan 1'})
    @IsNotEmpty()
    @IsString()
    nama: string;

    @ApiProperty ({ example: '18223085' })
    @IsNotEmpty()
    @IsString()
    nim: string;

    @ApiProperty({ example: 'https://storage.example.com/books/math.pdf'})
    @IsNotEmpty()
    @IsString()
    submission_url: string;
}