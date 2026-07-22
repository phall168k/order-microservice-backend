import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PermissionModule } from "./permission/permission.module";
import { RoleModule } from "./role/role.module";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "@app/database";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    PermissionModule,
    RoleModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
