import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE, RMQ_SERVICE } from "@app/contracts/rmq.constants";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";

@Module({
  imports: [
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
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}

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
