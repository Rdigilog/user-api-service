import { IsEmail, IsNotEmpty, IsString, IsObject } from 'class-validator';
import { mailSubjects, mailTemplates } from 'src/enums/subjects.enum';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: mailSubjects;

  @IsString()
  @IsNotEmpty()
  template: mailTemplates;

  @IsObject()
  @IsNotEmpty()
  content: any;
}

export interface EmailDynamicFields {
  [key: string]: string | number | boolean | Date;
}

export interface InviteEmailFields {
  recipientName: string; // The full name of the invitee
  companyName: string; // The company the invite is tied to
  roleName: string; // The role being assigned (e.g., ADMIN, STAFF)
  inviteLink: string; // The unique invite URL
  inviterName: string; // The person who sent the invite
}
