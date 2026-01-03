import { Module } from '@nestjs/common';
import { TugasAwalService } from './tugas-awal.service';
import { TugasAwalController } from './tugas-awal.controller';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  imports: [],
  controllers: [TugasAwalController],
  providers: [TugasAwalService, FirebaseService],
  exports: [TugasAwalService],
})

export class TugasAwalModule {}