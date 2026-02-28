import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards} from '@nestjs/common';

import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from "./dto/update-user.dto";
import {UsersService} from './users.service';

import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {Public} from "../auth/decorators/public.decorator";
import {OwnershipGuard} from "../auth/guard/ownership.guard";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Public()
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(OwnershipGuard)
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(OwnershipGuard)
    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(OwnershipGuard)
    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.usersService.remove(id);
    }
}