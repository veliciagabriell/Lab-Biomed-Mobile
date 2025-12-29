import { Module } from '@nestjs/common';
import { TugasAwalController } from './tugas-awal.controller';
import { TugasAwalService } from './tugas-awal.service';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  controllers: [TugasAwalController],
  providers: [TugasAwalService, FirebaseService],
  exports: [TugasAwalService],
})
export class TugasAwalModule {}
