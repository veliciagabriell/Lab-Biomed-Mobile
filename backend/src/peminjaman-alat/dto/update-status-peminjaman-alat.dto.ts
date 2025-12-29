import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusPeminjamanAlatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(['approved', 'rejected'])
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rejectedReason?: string;
}
