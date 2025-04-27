import { Injectable } from '@nestjs/common';
import { ClaimSubmissionResponseDto } from './dto/response/claim.dto';
import { Claim } from './interfaces';

@Injectable()
export class ClaimService {
  submitClaim(claimSubmissionRequest: Claim): ClaimSubmissionResponseDto {
    console.log(claimSubmissionRequest);
    return new ClaimSubmissionResponseDto();
  }
}
