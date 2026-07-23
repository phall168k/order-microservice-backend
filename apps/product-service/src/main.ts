import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { RMQ_SERVICE } from '@app/contracts/rmq.constants';

async function bootstrap() {
  const rabbitMqUrl = buildRabbitMqUrl();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitMqUrl],
        queue: RMQ_SERVICE.PRODUCT_SERVICE.QUEUE,
        queueOptions: {
          durable: false,
        },
        noAck: true,
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen();
  console.log("Product service is running...");
}

function buildRabbitMqUrl(): string {
  const username = encodeURIComponent(process.env.RABBITMQ_USERNAME ?? "admin");
  const password = encodeURIComponent(
    process.env.RABBITMQ_PASSWORD ?? "admin123",
  );
  const host = process.env.RABBITMQ_HOST ?? "localhost";
  const port = process.env.RABBITMQ_PORT ?? "5672";

  return `amqp://${username}:${password}@${host}:${port}`;
}

bootstrap().catch((error) => {
  console.error("Error starting the Auth service:", error);
  process.exit(1);
});
