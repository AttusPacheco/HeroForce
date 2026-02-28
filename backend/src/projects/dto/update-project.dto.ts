import {IsEnum, IsOptional, IsString} from 'class-validator';
import {ProjectStatus} from "../../enums/project-status.enum";

export class UpdateProjectDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;
}