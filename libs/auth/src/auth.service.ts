import { UtilsService } from '@app/utils';
import { Injectable } from '@nestjs/common';
import { UserService } from 'packages/repository/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly utilService: UtilsService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user) {
      const passwordMatch = await this.utilService.comparePassword(
        pass,
        user.password,
      );
      if (!passwordMatch) return null;
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }
}
