import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseService } from "./database.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("TYPEORM_HOST", "localhost"),
        port: Number(configService.get<string>("TYPEORM_PORT", "5432")),
        username: configService.getOrThrow<string>("TYPEORM_USERNAME"),
        password: configService.getOrThrow<string>("TYPEORM_PASSWORD"),
        database: configService.getOrThrow<string>("TYPEORM_DATABASE"),
        autoLoadEntities: true,
        synchronize:
          configService.get<string>("TYPEORM_SYNCHRONIZE", "false") === "true",
        logging:
          configService.get<string>("TYPEORM_LOGGING", "false") === "true",
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
