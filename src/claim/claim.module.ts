import { Module } from '@nestjs/common';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';

@Module({
  imports: [],
  controllers: [ClaimController],
  providers: [ClaimService],
})
export class ClaimModule {}
