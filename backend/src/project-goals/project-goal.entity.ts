import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import {ProjectStatus} from "../enums/project-status.enum";

@Entity('project_goals')
export class ProjectGoal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.PENDING,
    })
    status: ProjectStatus;

    @ManyToOne(() => Project, (project) => project.goals, {
        onDelete: 'CASCADE',
    })
    project: Project;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}