import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

// export const JwtConfig = JwtModule.register({
//   global: true,
//   secret: process.env.JWT_SECRET || 'supersecret', // ✅ must not be empty
//   signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
// });

export const JwtConfig = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: config.get<string>('JWT_EXPIRATION_TIME') },
  }),
})
