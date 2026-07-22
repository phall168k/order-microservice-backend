import { PartialType } from "@nestjs/swagger";
import { CreatePermissionRequestDto } from "./create-permission-request.dto";

export class UpdatePermissionRequestDto extends PartialType(
  CreatePermissionRequestDto,
) {}
