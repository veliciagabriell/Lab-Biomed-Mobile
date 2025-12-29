import { Module } from '@nestjs/common';
import { PeminjamanController } from './peminjaman.controller';
import { PeminjamanService } from './peminjaman.service';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
    controllers: [PeminjamanController],
    providers: [PeminjamanService, FirebaseService],
})
export class PeminjamanModule {}
