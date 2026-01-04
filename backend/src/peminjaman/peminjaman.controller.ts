import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PeminjamanService } from './peminjaman.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanStatusDto } from './dto/update-peminjaman.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Role } from '../auth/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Peminjaman Lab')
@Controller('api/peminjaman')
@ApiBearerAuth('access-token')
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
        if (req.user?.role !== Role.ASISTEN) {
            throw new ForbiddenException('Hanya asisten yang dapat mengakses ini');
        }
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
