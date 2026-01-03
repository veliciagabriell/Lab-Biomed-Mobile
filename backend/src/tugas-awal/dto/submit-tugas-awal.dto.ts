import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class SubmitTugasDto {
    @PrimaryGeneratedColumn('increment')
    @ApiProperty({ example: 1, description: 'Auto-generated submission id', required: false })
    @IsOptional()
    submissionId?: number;

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
    nilai: number;
}