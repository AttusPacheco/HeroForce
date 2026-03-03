import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateProjectGoalDto } from "./dto/create-project-goal.dto";
import { UpdateProjectGoalDto } from "./dto/update-project-goal.dto";
import { ProjectGoalsService } from "./project-goals.service";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/goals')
export class ProjectGoalsController {
    constructor(private readonly goalsService: ProjectGoalsService) { }

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

    @Patch(':id')
    update(
        @Param('projectId') projectId: string,
        @Param('id') id: string,
        @Body() dto: UpdateProjectGoalDto,
        @Req() req,
    ) {
        return this.goalsService.update(projectId, id, dto, req.user.id);
    }

    @Delete(':id')
    remove(
        @Param('projectId') projectId: string,
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.goalsService.remove(projectId, id, req.user.id);
    }
}