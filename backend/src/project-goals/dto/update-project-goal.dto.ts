import {IsDefined, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min} from 'class-validator';
import {ProjectStatus} from "../../enums/project-status.enum";

export class CreateProjectGoalDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;
}