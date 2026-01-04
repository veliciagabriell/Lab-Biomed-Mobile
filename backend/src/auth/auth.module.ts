import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '././strategies/jwt.strategy';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
    imports: [
        PassportModule, 
        JwtModule.register({
            secret: 'LAB_BIOMED',
            signOptions: { expiresIn: '24h' }, // Increased to 24h
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, FirebaseService],
    exports: [JwtModule, JwtStrategy, PassportModule], // Export untuk digunakan di module lain
})

export class AuthModule {}