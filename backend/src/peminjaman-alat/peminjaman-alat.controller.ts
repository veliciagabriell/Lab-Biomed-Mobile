import { Controller, Get, Post, Patch, Body, Param, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { PeminjamanAlatService } from './peminjaman-alat.service';
import { CreatePeminjamanAlatDto } from './dto/create-peminjaman-alat.dto';
import { UpdateStatusPeminjamanAlatDto } from './dto/update-status-peminjaman-alat.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@ApiTags('Peminjaman Alat')
@ApiBearerAuth('access-token')
@Controller('api/peminjaman-alat')
export class PeminjamanAlatController {
  constructor(private readonly peminjamanAlatService: PeminjamanAlatService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create peminjaman alat' })
  @ApiBody({ type: CreatePeminjamanAlatDto })
  @ApiResponse({ status: 201, description: 'Peminjaman berhasil dibuat' })
  async create(@Body() createDto: CreatePeminjamanAlatDto, @Request() req: any) {
    const userId = req.user?.userId || 'anonymous';
    return this.peminjamanAlatService.create(createDto, userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all peminjaman alat' })
  @ApiResponse({ status: 200, description: 'List of peminjaman alat' })
  async findAll(@Request() req: any) {
    const userId = req.user?.userId;
    const role = req.user?.role;
    return this.peminjamanAlatService.findAll(userId, role);
  }

  @Public()
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update status peminjaman alat' })
  @ApiBody({ type: UpdateStatusPeminjamanAlatDto })
  @ApiResponse({ status: 200, description: 'Status berhasil diupdate' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateStatusPeminjamanAlatDto,
  ) {
    return this.peminjamanAlatService.updateStatus(id, updateDto);
  }
}
