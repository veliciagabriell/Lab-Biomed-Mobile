import { Controller, Param, Get, Post, Body, HttpCode, HttpStatus, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TugasAwalService } from './tugas-awal.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubmiTugasDto } from './dto/submit-tugas-awal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Tugas Awal')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/tugas-awal')
export class TugasAwalController {
    constructor(private readonly tugasAwalService: TugasAwalService) {}

    @Post('/modul/:modulId')
    @ApiOperation({ summary: 'Submit tugas awal untuk modul tertentu' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SubmiTugasDto })
    @ApiResponse({ status: 201, description: 'Tugas awal berhasil disubmit' })
    @ApiResponse({ status: 401, description: 'Tidak berhasil submit tugas awal' })
    async submitTugasAwal(
        @Param('modulId', ParseIntPipe) modulId: number,
        @Body() submitDto: SubmiTugasDto,
    ) {
        return await this.tugasAwalService.submitTugasAwal(modulId, submitDto);
    }

    @Get('/modul/:modulId/status')
    @ApiOperation({ summary: 'Cek status tugas awal untuk nim tertentu' })
    @ApiQuery({ name: 'nim', required: true, type: String })
    @ApiResponse({ status: 200, description: 'Status tugas awal' })
    async checkStatus(
        @Param('modulId', ParseIntPipe) modulId: number,
        @Query('nim') nim: string,
    ) {
        const submission = await this.tugasAwalService.findByModulAndNim(modulId, nim);
        return {
            submitted: !!submission,
            submission,
        };
    }

    @Get('/modul/:modulId')
    @ApiOperation({ summary: 'Get semua tugas awal untuk modul tertentu' })
    @ApiResponse({ status: 200, description: 'List semua submissions' })
    async getAllByModul(@Param('modulId', ParseIntPipe) modulId: number) {
        return await this.tugasAwalService.findByModul(modulId);
    }
}
