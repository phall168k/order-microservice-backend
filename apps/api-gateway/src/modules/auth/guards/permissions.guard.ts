import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserPayloadResponseDto } from "apps/auth-service/src/auth/dto/user-payload-response.dto";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

type AuthenticatedRequest = {
  user?: UserPayloadResponseDto;
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException("Authenticated user was not found");
    }

    if (user.isAdmin) {
      return true;
    }

    const userPermissions = user.permissions ?? [];
    const hasPermission = this.hasAllRequiredPermissions(
      userPermissions,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    return true;
  }

  private hasAllRequiredPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    const userPermissionSet = new Set(userPermissions);
    return requiredPermissions.every((permission) =>
      userPermissionSet.has(permission),
    );
  }
}
