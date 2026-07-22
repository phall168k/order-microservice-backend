import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwagger } from "./swagger";
import { HttpResponseInterceptor } from "libs/http/response.interceptor";
import { UnprocessableEntityException, ValidationPipe, VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX ?? "api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  setupSwagger(app);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints ?? {}),
        }));

        return new UnprocessableEntityException({
          message: 'Unexceptable Entity',
          statusCode: 422,
          errors: formattedErrors,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
