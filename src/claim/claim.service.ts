import { Injectable } from '@nestjs/common';
import { ClaimSubmissionResponseDto } from './dto/response/claim.dto';
import { Claim, Policy } from './interfaces';
import { IncidentType, ReasonCode } from './constants';
import { existingPolicies } from './mocks';
import { isDefined } from 'class-validator';

@Injectable()
export class ClaimService {
  submitClaim(claimSubmissionRequest: Claim): ClaimSubmissionResponseDto {
    const claimantPolicy = this.findPolicy(claimSubmissionRequest.policyId);
    if (!isDefined(claimantPolicy)) {
      return this.formatResponse(false, 0, ReasonCode.POLICY_NOT_FOUND);
    }

    if (
      !this.evaluateIncidentDate(
        claimSubmissionRequest.incidentDate,
        claimantPolicy.startDate,
        claimantPolicy.endDate,
      )
    ) {
      return this.formatResponse(false, 0, ReasonCode.POLICY_INACTIVE);
    }

    if (
      !this.evaluateIncidentType(
        claimSubmissionRequest.incidentType,
        claimantPolicy.coveredIncidents,
      )
    ) {
      return this.formatResponse(false, 0, ReasonCode.NOT_COVERED);
    }

    const { approved, payout, reasonCode } = this.evaluateAmountClaimed(
      claimSubmissionRequest.amountClaimed,
      claimantPolicy.deductible,
      claimantPolicy.coverageLimit,
    );

    return this.formatResponse(approved, payout, reasonCode);
  }

  /**
   * Formats response
   * @param approved
   * @param payout
   * @param reasonCode
   * @returns Response as DTO
   */
  formatResponse(
    approved: boolean,
    payout: number,
    reasonCode: ReasonCode,
  ): ClaimSubmissionResponseDto {
    const response = new ClaimSubmissionResponseDto();

    response.approved = approved;
    response.payout = payout;
    response.reasonCode = reasonCode;

    return response;
  }

  /**
   * Searches for existing policy matching policyId
   * @param policyId - Policy Id of claimant
   * @returns Claimants policy if found
   */
  findPolicy(policyId: string): Policy | null {
    for (const policy of existingPolicies) {
      if (policy.policyId === policyId) return policy;
    }

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
    for (const coveredIncident of coveredIncidents) {
      if (coveredIncident === incidentType) return true;
    }

    return false;
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
    if (incidentDate <= endDate && incidentDate >= startDate) return true;
    return false;
  }

  /**
   * Evaluates the amount claimed against the policy
   * @param amountClaimed - Amount claimed by claimant
   * @param deductible - Deductible amount of claimant's policy
   * @param coverageLimit - Coverage limit of claimant's policy
   * @returns
   */
  evaluateAmountClaimed(
    amountClaimed: number,
    deductible: number,
    coverageLimit: number,
  ): { approved: boolean; payout: number; reasonCode: ReasonCode } {
    // Payout = amountClaimed - deductible
    const payout = amountClaimed - deductible;

    // If payout is zero or negative, return 0 with reasonCode: ZERO_PAYOUT
    if (payout <= 0) {
      return { approved: false, payout: 0, reasonCode: ReasonCode.ZERO_PAYOUT };
    }
    // The payout may not exceed the coverageLimit
    if (payout > coverageLimit) {
      return {
        approved: true,
        payout: coverageLimit,
        reasonCode: ReasonCode.APPROVED,
      };
    }

    // Normal approval and payout conditions
    return { approved: true, payout: payout, reasonCode: ReasonCode.APPROVED };
  }
}
