import { Controller, Param, ParseIntPipe, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ModulService } from './modul.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateModulDto } from './dto/create-modul.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Modul')
@ApiBearerAuth('access-token')
@Controller('api/modul')

export class ModulController {
    constructor(private readonly modulService: ModulService) {}

    @Public()
    @Get('praktikum/:praktikumId')
    @ApiOperation({ summary: 'Daftar modul praktikum'})
    async getModul(@Param('praktikumId', ParseIntPipe) praktikumId: number) {
        return this.modulService.findModulByPraktikumId(praktikumId);
    }

    @Public()
    @Get('detail/:id')
    @ApiOperation({ summary: 'Detail modul praktikum'})
    async getDetail(@Param('id', ParseIntPipe) id: number) {
        return this.modulService.findDetailModul(id);
    }

    @Post('praktikum')
    @ApiOperation({ summary: 'Buat modul praktikum baru'})
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: CreateModulDto})
    @ApiResponse({ status:201, description: 'Modul berhasil dibuat'})
    @ApiResponse({ status:401, description: 'Tidak berhasil membuat modul'})
    async createModul (@Body() createModulDto: CreateModulDto) {
        return await this.modulService.createModul(createModulDto);
    }
}