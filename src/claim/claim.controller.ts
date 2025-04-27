import { Body, Controller, Post } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimSubmissionRequestDto } from './dto/request/claim.dto';
import { ClaimSubmissionResponseDto } from './dto/response/claim.dto';

@Controller('claim')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Post()
  submitClaim(
    @Body() body: ClaimSubmissionRequestDto,
  ): ClaimSubmissionResponseDto {
    return this.claimService.submitClaim({
      policyId: body.policyId,
      incidentType: body.incidentType,
      incidentDate: new Date(body.incidentDate),
      amountClaimed: body.amountClaimed,
    });
  }
}
