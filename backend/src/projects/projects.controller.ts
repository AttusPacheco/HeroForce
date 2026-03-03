import {Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";
import {ProjectsService} from "./projects.service";
import {CreateProjectDto} from "./dto/create-project.dto";
import {UpdateProjectDto} from "./dto/update-project.dto";

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    findAll(
        @Req() req,
        @Query('page') page = '1',
        @Query('limit') limit = '10',
        @Query('status') status: string|null = null,
    ) {
        return this.projectsService.findAll(
            req.user.id,
            parseInt(page.toString()),
            parseInt(limit.toString()),
            status,
        );
    }

    @Post()
    create(
        @Body() dto: CreateProjectDto,
        @Req() req,
    ) {
        return this.projectsService.create(dto, req.user.id);
    }

    @Get('stats')
    getStats(@Req() req) {
        console.log(req.user.id);
        return this.projectsService.getStats(req.user.id);
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