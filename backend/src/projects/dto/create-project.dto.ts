import {IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {ProjectStatus} from "../../enums/project-status.enum";

export class CreateProjectDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;
}