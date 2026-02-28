import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {ProjectGoal} from './project-goal.entity';
import {Project} from '../projects/project.entity';

import {ProjectGoalsService} from './project-goals.service';
import {ProjectGoalsController} from './project-goals.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProjectGoal,
            Project,
        ]),
    ],
    controllers: [ProjectGoalsController],
    providers: [ProjectGoalsService],
})
export class ProjectGoalsModule {}