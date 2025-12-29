import { Controller, Param, Patch, Get, Post, Body, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { TugasAwalService } from './tugas-awal.service';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTugasDto } from './dto/create-tugas-awal.dto';
import { SubmitTugasDto } from './dto/submit-tugas-awal.dto';

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
        submitTugasDto.submissionId = submitTugasDto.submissionId ?? submitTugasDto.submissionId;
        (submitTugasDto as any).modulId = modulId;
        return await this.tugasAwalService.submitTugas(submitTugasDto);
    }

    //asisten
    //liat semua submission praktikan
    @Get('/modul/:modulId/submission')
    @ApiOperation({ summary: 'Submission semua praktikan per modul' })
    async findAllSubmission(@Param('modulId', ParseIntPipe) modulId: number) {
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
        @Param('modulId', ParseIntPipe) modulId: number,
        @Body() createTugasDto: CreateTugasDto,
    ) {
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
        @Param('submissionId', ParseIntPipe) submissionId: number,
        @Body() submitTugasDto: SubmitTugasDto,
    ) {
        return await this.tugasAwalService.giveNilai(submissionId, submitTugasDto);
    }
}