import { HttpModule } from '@nestjs/axios/dist/http.module';

export const HttpModuleConfig: any = HttpModule.register({
  timeout: 5000,
  maxRedirects: 5,
});
