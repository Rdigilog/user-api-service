import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './generic.dto';

export class TokenDataDto {
  @ApiProperty({ example: 'JA5T6SL2F4VHANDLGQUVG2JOKNLW66RT' })
  token: string;
}

export class RoleDto {
  @ApiProperty({ example: '43cabb3a-6e49-4d57-ba09-cc6953922f67' })
  id: string;

  @ApiProperty({ example: 'SUPER_ADMIN' })
  name: string;

  @ApiProperty({ example: null, nullable: true })
  description: string | null;

  @ApiProperty({ example: '2025-10-14T09:05:17.519Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-14T09:05:17.519Z' })
  updatedAt: string;

  @ApiProperty({ example: false })
  archived: boolean;
}

export class UserRoleDto {
  @ApiProperty({ example: null, nullable: true })
  companyId: string | null;

  @ApiProperty({ type: () => RoleDto })
  role: RoleDto;

  @ApiProperty({ example: null, nullable: true })
  company: any;
}

export class ProfileDto {
  @ApiProperty({ example: '91e5af75-b8e3-4b8a-849a-85a54200f5ab' })
  id: string;

  @ApiProperty({ example: 'Super Admin' })
  firstName: string;

  @ApiProperty({ example: 'Admin' })
  lastName: string;

  @ApiProperty({ example: 'engineeringteam@radiantlife.co.uk' })
  email: string;

  @ApiProperty({ example: null, nullable: true })
  imageUrl: string | null;

  @ApiProperty({ example: '08011223344' })
  phoneNumber: string;

  @ApiProperty({ example: 'baf2fff1-d1b8-4c42-8362-78d8f53bfcbd' })
  userId: string;

  @ApiProperty({ example: '2025-10-14T09:05:27.501Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-14T09:05:27.501Z' })
  updatedAt: string;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ example: 'APPROVED' })
  status: string;
}

export class UserInfoDto {
  @ApiProperty({ example: 'baf2fff1-d1b8-4c42-8362-78d8f53bfcbd' })
  id: string;

  @ApiProperty({ example: 'engineeringteam@radiantlife.co.uk' })
  email: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: false })
  deleted: boolean;

  @ApiProperty({ type: () => ProfileDto })
  profile: ProfileDto;

  @ApiProperty({ type: () => [UserRoleDto] })
  userRole: UserRoleDto[];
}

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYWYyZmZmMS1kMWI4LTRjNDItODM2Mi03OGQ4ZjUzYmZjYmQiLCJ1c2VybmFtZSI6ImVuZ2luZWVyaW5ndGVhbUByYWRpYW50bGlmZS5jby51ayIsImlhdCI6MTc2MDQzOTc3MiwiZXhwIjoxNzYwNTI2MTcyfQ.yJ0Uri2DwPAmLtDkERMgr0-DBPA6Yi_XeoCvQC7cG5g',
  })
  access_token: string;

  @ApiProperty({ example: '1d' })
  expiresIn: string;

  @ApiProperty({ type: () => UserInfoDto })
  user_info: UserInfoDto;
}

// export class LoginResponseDTO extends ApiResponseDto<TokenDataDto>{
//     // data:TokenDataDto
// }
