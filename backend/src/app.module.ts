import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PraktikumModule } from './praktikum/praktikum.module';
import { ModulModule } from './modul/modul.module';
import { PresensiModule } from './presensi/presensi.module'
import { UsersModule } from './users/users.module';
import { FirebaseService } from '../firebase/firebase.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [AuthModule, PraktikumModule, UsersModule, ModulModule, PresensiModule],
  controllers: [AppController],
  providers: [AppService, FirebaseService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
