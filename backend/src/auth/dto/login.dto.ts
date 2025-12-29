import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from 'class-validator';
import { Role } from '../role.enum';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com'})
    @IsEmail({}, { message: 'Format email invalid' })
    email: string;

    @ApiProperty({ example: 'labBiomedPass123'})
    @MinLength(8, { message: 'Password minimal 8 karakter' })
    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password harus mengandung huruf besar, huruf kecil, dan angka',
    })
    password: string;

    @ApiProperty({ 
        enum: [Role.ASISTEN, Role.PRAKTIKAN],
        example: Role.PRAKTIKAN,
        description: 'Pilih role asisten atau praktikan',
        required: true,
    })
    @IsEnum([Role.ASISTEN, Role.PRAKTIKAN], { message: 'Role harus berupa asisten atau praktikan' })
    role?: Role.ASISTEN | Role.PRAKTIKAN;
}