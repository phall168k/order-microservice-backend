import { Module } from "@nestjs/common";
import { PermissionModule } from "./permission/permission.module";
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    PermissionModule,
    RoleModule
  ],
})
export class SystemModule {}
