import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class SubmitTugasDto {
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

    @ApiProperty({ example: 100})
    @IsOptional()
    @IsNumber()
    nilai?: number;

    @ApiProperty({ example: 1, description: 'Module ID (set from URL param)' })
    @IsOptional()
    @IsNumber()
    modulId?: number;
}