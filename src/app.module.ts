import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ContextModule } from "./common/context/context.module";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";
import { APP_INTERCEPTOR, Reflector } from "@nestjs/core";
import { ResponseStandardizationInterceptor } from "./common/interceptors/response-standardization.interceptor";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma.module";
import { UsersModule } from "./users/users.module";
import { ProjectsModule } from "./projects/projects.module";
import { BlogModule } from "./blog/blog.module";
import { ServicesOfferedModule } from "./services-offered/services.module";
import { TutorialsModule } from "./tutorials/tutorials.module";
import { TechStackModule } from "./tech-stack/tech-stack.module";
import { CVModule } from "./cv/cv.module";
import { ContactModule } from "./contact/contact.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ContextModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    BlogModule,
    ServicesOfferedModule,
    TutorialsModule,
    TechStackModule,
    CVModule,
    ContactModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStandardizationInterceptor,
    },
    Reflector,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
