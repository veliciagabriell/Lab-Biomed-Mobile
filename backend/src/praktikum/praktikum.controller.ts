import { Controller, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { PraktikumService } from './praktikum.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { Public } from '../auth/public.decorator';

@ApiTags('Praktikum')
@ApiBearerAuth('access-token')
@Controller('api/praktikum')

export class PraktikumController {
    constructor(private readonly praktikumService: PraktikumService) {}

    @Get(':id')
    @ApiOperation({ summary: 'Pilih id Praktikum Teknik Biomedis'})
    async getKategori(@Param('id', ParseIntPipe) id: number) {
        return this.praktikumService.findOnePrak(id);
    }
}