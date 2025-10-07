import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  isTokenValid(secret: string, token: string) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      digits: 6,
      window: 2, // Increase window to 2 to allow for slight time drift
      step: 300, // Match the step size for verification
    });
  }

  secretOTP() {
    const secret = speakeasy.generateSecret({ length: 20 });
    const code = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 300, // Match the step size for generation
      digits: 6, // Typically 6 digits, but can be adjusted if needed
    });
    const isValid = this.isTokenValid(secret.base32, code);
    console.log('this is the validity check result', isValid);
    return { code, secret: secret.base32 };
  }
}
