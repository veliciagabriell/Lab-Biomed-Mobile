import { Controller, Param, Get, Post, Body, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PresensiDto } from './dto/presensi.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Presensi')
@ApiBearerAuth('access-token')
@Controller('api/presensi')

export class PresensiController {
    constructor(private readonly presensiService: PresensiService) {}
    
    @Public()
    @Get('/modul/:modulId')
    @ApiOperation({ summary: 'Daftar presensi per modulId' })
    async getByModul(@Param('modulId', ParseIntPipe) modulId: number) {
        return this.presensiService.getPresensiByModulId(modulId);
    }

    @Public()
    @Post('/modul/:modulId')
    @ApiOperation ({ summary: 'Kirim presensi untuk modul tertentu' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: PresensiDto })
    @ApiResponse({ status: 201, description: 'Presensi berhasil dikirim'})
    @ApiResponse({ status: 401, description: 'Tidak berhasil mengirim presensi'})
    async createPresensi (
        @Param('modulId', ParseIntPipe) modulId: number,
        @Body() presensiDto: PresensiDto,
    ) {
        presensiDto.modulId = presensiDto.modulId ?? modulId;
        return await this.presensiService.sendPresensi(presensiDto);
    }
}