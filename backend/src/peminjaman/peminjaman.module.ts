import { Module } from '@nestjs/common';
import { PeminjamanController } from './peminjaman.controller';
import { PeminjamanService } from './peminjaman.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [PeminjamanController],
    providers: [PeminjamanService, FirebaseService],
})
export class PeminjamanModule {}
