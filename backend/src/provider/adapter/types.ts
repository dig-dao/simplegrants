import { PaymentProvider, User } from '@prisma/client';
import {
  FeeAllocationMethod,
  GrantWithFunding,
} from 'src/grants/grants.interface';
import { PrismaService } from 'src/prisma/prisma.service';

export interface PaymentProviderConstructorProps {
  prisma: PrismaService;
  apiKey: string;
}

export interface PaymentProviderAdapter {
  getDetails(): Promise<PaymentProvider>;
  createPayment(
    grantWithFunding: GrantWithFunding[],
    feeAllocation: FeeAllocationMethod,
    user: User,
  ): any;
  handleWebhook?(data: any): Promise<void>;
}
