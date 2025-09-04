import { Injectable } from '@nestjs/common';

@Injectable()
export class BranchDepartmentService {
  getHello(): string {
    return 'Hello World!';
  }
}
