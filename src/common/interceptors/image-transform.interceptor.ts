import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { from, Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { StorageService } from "../../storage/storage.service";

@Injectable()
export class ImageTransformInterceptor implements NestInterceptor {
  constructor(private readonly storageService: StorageService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      mergeMap((data: unknown) => {
        if (data && typeof data === "object") {
          return from(this.transformImageKeys(data));
        }
        return from(Promise.resolve(data));
      }),
    );
  }

  private async transformImageKeys(obj: unknown): Promise<unknown> {
    if (Array.isArray(obj)) {
      return Promise.all(obj.map((item) => this.transformImageKeys(item)));
    }

    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    const transformed: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (key === "image" && typeof value === "string" && value) {
        transformed[key] = this.storageService.getObjectUrl(value);
      } else if (typeof value === "object" && value !== null) {
        transformed[key] = await this.transformImageKeys(value);
      } else {
        transformed[key] = value;
      }
    }

    return transformed;
  }
}
