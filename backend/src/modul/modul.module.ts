import { Module } from '@nestjs/common';
import { ModulService } from './modul.service';
import { ModulController } from './modul.controller';
import { FirebaseService } from '../../firebase/firebase.service';

@Module({
  imports: [],
  controllers: [ModulController],
  providers: [ModulService, FirebaseService],
  exports: [ModulService],
})

export class ModulModule {}