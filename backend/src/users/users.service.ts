import * as bcrypt from 'bcrypt';
import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {User} from './user.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from "./dto/update-user.dto";

import { ensureUniqueField } from '../common/database/helpers/ensure-unique-field.helper';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {
    }

    findAll() {
        return this.usersRepository.find();
    }

    async create(createUserDto: CreateUserDto) {
        await ensureUniqueField(
            this.usersRepository,
            'email',
            createUserDto.email,
            'E-mail já cadastrado',
        );

        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            10,
        );

        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return await this.usersRepository.save(user);
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOneBy({id});

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.usersRepository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        await ensureUniqueField(
            this.usersRepository,
            'email',
            updateUserDto.email,
            'E-mail já cadastrado',
            id,
        );

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(
                updateUserDto.password,
                10,
            );
        }

        const updatedUser = this.usersRepository.merge(
            user,
            updateUserDto,
        );

        await this.usersRepository.save(updatedUser);

        return await this.usersRepository.findOne({
            where: { id },
        });
    }

    async remove(id: string) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return this.usersRepository.delete(id);
    }
}