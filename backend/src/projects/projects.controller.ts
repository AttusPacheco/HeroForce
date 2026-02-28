import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {ProjectsService} from "./projects.service";
import {CreateProjectDto} from "./dto/create-project.dto";
import {UpdateProjectDto} from "./dto/update-project.dto";

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    findAll(@Req() req) {
        return this.projectsService.findAll(req.user.id);
    }

    @Post()
    create(
        @Body() dto: CreateProjectDto,
        @Req() req,
    ) {
        return this.projectsService.create(dto, req.user.id);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @Req() req,
    ) {
        return this.projectsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateProjectDto,
        @Req() req,
    ) {
        return this.projectsService.update(id, dto, req.user.id);
    }

    @Delete(':id')
    remove(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req,
    ) {
        return this.projectsService.remove(id, req.user.id);
    }
}