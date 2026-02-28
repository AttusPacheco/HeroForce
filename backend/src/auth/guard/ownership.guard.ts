import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        const user = request.user;
        const paramId = request.params.id;

        if (user.role === 'ADMIN') {
            return true;
        }

        if (user.id !== paramId) {
            throw new ForbiddenException(
                'Você não tem permissão para acessar este recurso',
            );
        }

        return true;
    }
}