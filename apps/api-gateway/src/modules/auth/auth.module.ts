import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE, RMQ_SERVICE } from "@app/contracts/rmq.constants";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PassportModule } from "@nestjs/passport";
import { PermissionGuard } from "./guards/permissions.guard";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [buildRabbitMqUrl(configService)],
            queue: RMQ_SERVICE.AUTH_SERVICE.QUEUE,
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    }
  ],
  controllers: [AuthController],
})
export class AuthModule {}

function buildRabbitMqUrl(configService: ConfigService): string {
  const username = encodeURIComponent(
    configService.get<string>("RABBITMQ_USERNAME", "admin"),
  );
  const password = encodeURIComponent(
    configService.get<string>("RABBITMQ_PASSWORD", "admin123"),
  );
  const host = configService.get<string>("RABBITMQ_HOST", "localhost");
  const port = configService.get<string>("RABBITMQ_PORT", "5672");

  return `amqp://${username}:${password}@${host}:${port}`;
}
