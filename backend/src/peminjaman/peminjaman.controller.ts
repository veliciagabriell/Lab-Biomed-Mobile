import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanStatusDto } from './dto/update-peminjaman.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/peminjaman')
@UseGuards(JwtAuthGuard)
export class PeminjamanController {
    constructor(private readonly peminjamanService: PeminjamanService) {}

    @Post()
    create(@Body() createDto: CreatePeminjamanDto, @Request() req) {
        return this.peminjamanService.create(
            createDto,
            req.user.sub, // userId from JWT
            req.user.email
        );
    }

    @Get()
    findAll(@Request() req) {
        return this.peminjamanService.findAll(req.user.sub, req.user.role);
    }

    @Get('date/:date')
    findByDate(@Param('date') date: string) {
        return this.peminjamanService.findByDate(date);
    }

    @Get('slots/:date')
    getAvailableSlots(@Param('date') date: string) {
        return this.peminjamanService.getAvailableSlots(date);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.peminjamanService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdatePeminjamanStatusDto,
        @Request() req
    ) {
        return this.peminjamanService.updateStatus(
            id,
            updateDto,
            req.user.sub,
            req.user.role
        );
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string, @Request() req) {
        return this.peminjamanService.cancel(id, req.user.sub);
    }
}
