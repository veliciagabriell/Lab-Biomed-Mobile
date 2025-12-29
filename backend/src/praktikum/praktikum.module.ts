import { Module } from '@nestjs/common';
import { PraktikumService } from './praktikum.service';
import { PraktikumController } from './praktikum.controller';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  imports: [],
  controllers: [PraktikumController],
  providers: [PraktikumService, FirebaseService],
  exports: [PraktikumService],
})

export class PraktikumModule {}