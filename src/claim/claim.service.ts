import { Injectable } from '@nestjs/common';
import { ClaimSubmissionResponseDto } from './dto/response/claim.dto';
import { Claim, Policy } from './interfaces';
import { IncidentType, ReasonCode } from './constants';

@Injectable()
export class ClaimService {
  submitClaim(claimSubmissionRequest: Claim): ClaimSubmissionResponseDto {
    console.log(claimSubmissionRequest);
    return new ClaimSubmissionResponseDto();
  }

  /**
   * Searches for existing policy matching policyId
   * @param policyId - Policy Id of claimant
   * @returns Claimants policy if found
   */
  findPolicy(policyId: string): Policy | null {
    console.log(policyId);
    return null;
  }

  /**
   * Evaluates whether the incident type claimed matches the covered incidents on the policy
   * @param incidentType - Incident claimed
   * @param coveredIncidents - Incidents covered by claimants policy
   * @returns true if claimed incident is a covered
   */
  evaluateIncidentType(
    incidentType: IncidentType,
    coveredIncidents: IncidentType[],
  ): boolean {
    console.log(incidentType, coveredIncidents);
    return true;
  }

  /**
   * Evaluates whether the policy was active on the incident date
   * @param incidentDate - Date incident is claimed for
   * @param startDate - Start date of policy
   * @param endDate - End date of policy
   * @returns true if policy was active on the incident date
   */
  evaluateIncidentDate(
    incidentDate: Date,
    startDate: Date,
    endDate: Date,
  ): boolean {
    console.log(incidentDate, startDate, endDate);
    return true;
  }

  /**
   * Evaluates the amount claimed against the policy
   * Business Logic:
   * payout: amountClaimed - deductible
   * reasonCode: APPROVED if payout is > 0, ZERO_PAYOUT if payout is zero or negative
   * @param amountClaimed - Amount claimed by claimant
   * @param deductible - Deductible amount of claimant's policy
   * @param coverageLimit - Coverage limit of claimant's policy
   * @returns
   */
  evaluateAmountClaimed(
    amountClaimed: number,
    deductible: number,
    coverageLimit: number,
  ): { reasonCode: ReasonCode; payout: number } {
    console.log(amountClaimed, deductible, coverageLimit);
    return { reasonCode: ReasonCode.ZERO_PAYOUT, payout: 0 };
  }
}
