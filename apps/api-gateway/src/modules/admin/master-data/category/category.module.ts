import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, RMQ_SERVICE } from '@app/contracts/rmq.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: PRODUCT_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [buildRabbitMqUrl(configService)],
            queue: RMQ_SERVICE.PRODUCT_SERVICE.QUEUE,
            queueOptions: { durable: false },
          }
        })
      }
    ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule {}

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
