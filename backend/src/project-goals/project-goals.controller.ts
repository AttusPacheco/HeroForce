import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {CreateProjectGoalDto} from "./dto/create-project-goal.dto";
import {ProjectGoalsService} from "./project-goals.service";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/goals')
export class ProjectGoalsController {
    constructor(private readonly goalsService: ProjectGoalsService) {}

    @Get()
    findAll(
        @Param('projectId') projectId: string,
        @Req() req,
    ) {
        return this.goalsService.findAll(projectId, req.user.id);
    }

    @Post()
    create(
        @Param('projectId') projectId: string,
        @Body() dto: CreateProjectGoalDto,
        @Req() req,
    ) {
        return this.goalsService.create(projectId, dto, req.user.id);
    }
}