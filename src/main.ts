import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ContextService } from "./common/context/context.service";
import { json, urlencoded } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Increase payload limit for Base64 image data URLs & rich content (50MB)
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  // Allow frontend integration from configured origins.
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : true;
  app.enableCors({
    origin: allowedOrigins,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
  });

  // Enable Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints;
          if (constraints) {
            return Object.values(constraints).join(", ");
          }
          return `Validation failed for ${error.property}`;
        });
        return new BadRequestException({
          statusCode: 400,
          message: messages,
          error: "Validation Failed",
        });
      },
    }),
  );

  // Register Global Exception Filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  const contextService = app.get(ContextService);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost, contextService),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
