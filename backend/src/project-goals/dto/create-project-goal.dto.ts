import {IsDefined, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min} from 'class-validator';
import {ProjectStatus} from "../../enums/project-status.enum";

export class CreateProjectGoalDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDefined()
    @IsString()
    description?: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;
}