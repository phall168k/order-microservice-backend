import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwagger } from "./swagger";
import { HttpResponseInterceptor } from "libs/http/response.interceptor";
import { ValidationPipe, VersioningType } from "@nestjs/common";

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
    }),
  );
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
