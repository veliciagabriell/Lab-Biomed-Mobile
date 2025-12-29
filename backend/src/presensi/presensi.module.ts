import { Module } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { PresensiController } from './presensi.controller';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  imports: [],
  controllers: [PresensiController],
  providers: [PresensiService, FirebaseService],
  exports: [PresensiService],
})

export class PresensiModule {}