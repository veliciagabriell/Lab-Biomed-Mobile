import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTugasDto {
    @ApiProperty({ example: 'https://drive.google.com/file/d/xxxxx'})
    @IsNotEmpty()
    @IsString()
    tugas_url: string;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsNumber()
    modulId?: number;
}