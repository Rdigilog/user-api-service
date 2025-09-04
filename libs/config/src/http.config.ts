import { HttpModule } from '@nestjs/axios/dist/http.module';

export const HttpModuleConfig = HttpModule.register({
  timeout: 5000,
  maxRedirects: 5,
});
