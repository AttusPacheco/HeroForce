import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';

import { User } from '../users/user.entity';
import {ProjectGoal} from "../project-goals/project-goal.entity";
import {ProjectStatus} from "../enums/project-status.enum";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column({
        type: 'enum',
        enum: ProjectStatus,
        default: ProjectStatus.PENDING,
    })
    status: ProjectStatus;

    @ManyToOne(() => User, (user) => user.projects, {
        onDelete: 'CASCADE',
    })
    owner: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ProjectGoal, (goal) => goal.project)
    goals: ProjectGoal[];
}