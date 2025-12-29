import { Module } from '@nestjs/common';
import { PeminjamanAlatController } from './peminjaman-alat.controller';
import { PeminjamanAlatService } from './peminjaman-alat.service';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  controllers: [PeminjamanAlatController],
  providers: [PeminjamanAlatService, FirebaseService],
  exports: [PeminjamanAlatService],
})
export class PeminjamanAlatModule {}
