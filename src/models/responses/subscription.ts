import { ApiProperty } from '@nestjs/swagger';

/**
 * Company DTO
 */
export class CompanyDto {
  @ApiProperty({ example: 'The Rabbi Tech' })
  name: string;

  @ApiProperty({ example: 'tipson664@gmail.com' })
  email: string;

  @ApiProperty({ example: '2348067843337' })
  phoneNumber: string;
}

/**
 * Plan DTO
 */
export class PlanDto {
  @ApiProperty({ example: '6d3147cd-c872-4a3c-85b8-74b510b954de' })
  id: string;

  @ApiProperty({ example: 'digiCare' })
  name: string;

  @ApiProperty({ example: null, nullable: true })
  description: string | null;

  @ApiProperty({ example: '£' })
  currency: string;

  @ApiProperty({ example: 0 })
  price: number;

  @ApiProperty({ example: 'month' })
  billingPeriod: string;

  @ApiProperty({ example: 0 })
  minimumUsers: number;

  @ApiProperty({ example: 0 })
  additionalUserCost: number;

  @ApiProperty({ example: null, nullable: true })
  colorTheme: string | null;

  @ApiProperty({ example: null, nullable: true })
  buttonText: string | null;

  @ApiProperty({ example: null, nullable: true })
  badge: string | null;

  @ApiProperty({ example: null, nullable: true })
  discount: string | null;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: false })
  archived: boolean;

  @ApiProperty({ example: '2025-10-14T09:05:24.076Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-14T09:05:24.076Z' })
  updatedAt: string;
}

/**
 * Invoice DTO
 */
export class InvoiceDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'RDFJSMHAFOL19' })
  invoiceNo: string;

  @ApiProperty({ example: '2025-10-28T10:38:32.829Z' })
  date: string;

  @ApiProperty({ example: 0 })
  amount: number;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: '6d3147cd-c872-4a3c-85b8-74b510b954de' })
  planId: string;

  @ApiProperty({ example: '2025-10-28T10:38:32.831Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-28T10:38:32.831Z' })
  updatedAt: string;

  @ApiProperty({ example: '1ba0e7a8-7198-446c-ae17-7eecaa898338' })
  companyId: string;

  @ApiProperty({ type: () => PlanDto })
  plan: PlanDto;

  @ApiProperty({ type: () => CompanyDto })
  company: CompanyDto;
}

export class SubscriptionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '1ba0e7a8-7198-446c-ae17-7eecaa898338' })
  companyId: string;

  @ApiProperty({ example: '6d3147cd-c872-4a3c-85b8-74b510b954de' })
  planId: string;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: '2025-11-27T11:08:52.651Z' })
  nextBilling: string;

  @ApiProperty({ example: 0 })
  users: number;

  @ApiProperty({ example: 0 })
  totalAmount: number;

  @ApiProperty({ example: '2025-10-28T10:08:52.654Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-10-28T10:08:52.654Z' })
  updatedAt: string;

  @ApiProperty({ example: true })
  archived: boolean;

  @ApiProperty({ type: () => PlanDto })
  plan: PlanDto;

  @ApiProperty({ type: () => CompanyDto })
  company: CompanyDto;
}

export class SubscriptionSummaryDto {
  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Total revenue generated from subscriptions',
  })
  totalRevenue: number | null;

  @ApiProperty({
    example: 0,
    description: 'Total number of currently active subscriptions',
  })
  totalActiveSubscription: number;

  @ApiProperty({
    example: 0,
    description: 'Total number of subscriptions expiring soon',
  })
  totalExpiringSoon: number;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Total monthly recurring revenue (MRR)',
  })
  monththlyReoccuring: number | null;
}
