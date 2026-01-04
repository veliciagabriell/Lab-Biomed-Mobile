import { Controller, Param, Patch, Get, Post, Body, HttpCode, HttpStatus, ParseIntPipe, Request, ForbiddenException } from '@nestjs/common';
import { TugasAwalService } from './tugas-awal.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTugasDto } from './dto/create-tugas-awal.dto';
import { SubmitTugasDto } from './dto/submit-tugas-awal.dto';
import { Role } from '../auth/role.enum';

@ApiTags('Tugas Awal')
@ApiBearerAuth('access-token')
@Controller('api/tugas-awal')

export class TugasAwalController {
    constructor(private readonly tugasAwalService: TugasAwalService) {}

    //praktikan
    @Get('/modul/:modulId')
    @ApiOperation({ summary: 'Dokumen tugas awal' })
    async getTugasByModul(@Param('modulId', ParseIntPipe) modulId: number) {
        return this.tugasAwalService.getTugasAwal(modulId);
    }

    @Post('/modul/:modulId/submission')
    @ApiOperation({ summary: 'Submit tugas awal' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SubmitTugasDto })
    @ApiResponse({ status: 201, description: 'Tugas berhasil disubmit'})
    @ApiResponse({ status: 401, description: 'Tidak berhasil submit tugas'})
    async submitTugas (
        @Param('modulId', ParseIntPipe) modulId: number,
        @Body() submitTugasDto: SubmitTugasDto,
    ) {
        console.log('Received modulId from URL:', modulId);
        console.log('Received body:', JSON.stringify(submitTugasDto, null, 2));
        submitTugasDto.modulId = modulId;
        console.log('After setting modulId:', JSON.stringify(submitTugasDto, null, 2));
        return await this.tugasAwalService.submitTugas(submitTugasDto);
    }

    //asisten
    //liat semua submission praktikan
    @Get('/modul/:modulId/submission')
    @ApiOperation({ summary: 'Submission semua praktikan per modul' })
    async findAllSubmission(@Param('modulId', ParseIntPipe) modulId: number, @Request() req: any) {
        if (req.user?.role !== Role.ASISTEN) {
            throw new ForbiddenException('Hanya asisten yang dapat mengakses ini');
        }
        return await this.tugasAwalService.getSubmission(modulId);
    }

    //upload dokumen tugas awal
    @Post('/modul/:modulId')
    @ApiOperation({ summary: 'Upload dokumen tugas awal' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: CreateTugasDto })
    @ApiResponse({ status: 201, description: 'Dokumen tugas awal berhasil diupload'})
    @ApiResponse({ status: 401, description: 'Dokumen tugas awal tidak berhasil diupload'})
    async uploadTugas(
        @Param('modulId', ParseIntPipe) modulId: number, @Request() req: any,
        @Body() createTugasDto: CreateTugasDto,
    ) {
        if (req.user?.role !== Role.ASISTEN) {
            throw new ForbiddenException('Hanya asisten yang dapat mengakses ini');
        }
        (createTugasDto as any).modulId = modulId;
        return await this.tugasAwalService.uploadTugas(createTugasDto);
    }

    //kasih nilai
    @Patch('/modul/:modulId/submission/:submissionId/grade')
    @ApiOperation({ summary: 'Memberikan nilai tugas awal' })
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SubmitTugasDto })
    @ApiResponse({ status: 201, description: 'Berhasil memberikan nilai'})
    @ApiResponse({ status: 401, description: 'Tidak berhasil memberikan nilai'})
    async giveNilai(
        @Param('modulId', ParseIntPipe) modulId: number,
        @Param('submissionId') submissionId: string,
        @Request() req: any,
        @Body() submitTugasDto: SubmitTugasDto,
    ) {
        if (req.user?.role !== Role.ASISTEN) {
            throw new ForbiddenException('Hanya asisten yang dapat mengakses ini');
        }
        return await this.tugasAwalService.giveNilai(submissionId, submitTugasDto);
    }
}