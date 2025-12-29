import { Controller, Param, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PresensiDto } from './dto/presensi.dto';

@ApiTags('Presensi')
@ApiBearerAuth('access-token')
@Controller('api/presensi')

export class PresensiController {
    constructor(private readonly presensiService: PresensiService) {}

    @Get(':nim')
    @ApiOperation ({ summary: 'Daftar presensi (asisten)'})
    async getPresensi(@Param('nim') nim: string) {
        return this.presensiService.getPresensiByNim(nim);
    }

    @Get('')
    @ApiOperation({ summary: 'Daftar semua presensi' })
    async getAllPresensi() {
        return this.presensiService.getAllPresensi();
    }

    @Post('')
    @ApiOperation ({ summary: 'Kirim presensi (praktikan)'})
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: PresensiDto })
    @ApiResponse({ status: 201, description: 'Presensi berhasil dikirim'})
    @ApiResponse({ status: 401, description: 'Tidak berhasil mengirim presensi'})
    async createPresensi (@Body() presensiDto: PresensiDto) {
        return await this.presensiService.sendPresensi(presensiDto);
    }
}