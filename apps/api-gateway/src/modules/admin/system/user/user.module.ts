import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, RMQ_SERVICE } from '@app/contracts/rmq.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}

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
