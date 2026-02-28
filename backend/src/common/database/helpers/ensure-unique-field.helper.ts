import {BadRequestException} from '@nestjs/common';
import {ObjectLiteral, Repository} from 'typeorm';

export async function ensureUniqueField<T extends ObjectLiteral>(
    repository: Repository<T>,
    field: keyof T,
    value: any,
    message: string,
    ignoreId?: string,
) {
    if (!value) return;

    const where: any = {[field]: value};

    if (ignoreId) {
        where.id = {$ne: ignoreId};
    }

    const exists = await repository.findOne({where});

    if (exists) {
        throw new BadRequestException(message);
    }
}