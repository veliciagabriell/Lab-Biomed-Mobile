import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')

export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('profile/:id')
    @ApiOperation({ summary: 'Get user profile by ID' })
    async getProfile(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }
}