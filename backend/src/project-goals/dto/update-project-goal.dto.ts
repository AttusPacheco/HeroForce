import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from "../../enums/project-status.enum";

export class UpdateProjectGoalDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;
}