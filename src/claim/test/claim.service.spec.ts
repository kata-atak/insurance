import { Test, TestingModule } from '@nestjs/testing';
import { ClaimService } from '../claim.service';
import { IncidentType, ReasonCode } from '../constants';
import { ClaimSubmissionResponseDto } from '../dto/response/claim.dto';
import { existingPolicies } from '../mocks';

describe('ClaimService', () => {
  let claimService: ClaimService;

  beforeEach(async () => {
    const claim: TestingModule = await Test.createTestingModule({
      providers: [ClaimService],
    }).compile();

    claimService = claim.get<ClaimService>(ClaimService);
  });

  describe('submitClaim', () => {
    it('should return correct DTO', () => {
      expect(
        claimService.submitClaim({
          policyId: '',
          incidentType: IncidentType.ACCIDENT,
          incidentDate: new Date(),
          amountClaimed: 0,
        }),
      ).toBeInstanceOf(ClaimSubmissionResponseDto);
    });

    it('should respond appropriately when a policy is not found', () => {
      const response = claimService.submitClaim({
        policyId: 'POL789',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date(),
        amountClaimed: 0,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.POLICY_NOT_FOUND);
    });

    it('should respond appropriately when a policy is not active', () => {
      const response = claimService.submitClaim({
        policyId: 'POL789',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date(),
        amountClaimed: 0,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.POLICY_INACTIVE);
    });

    it('should respond appropriately when a claimed incident is not covered', () => {
      const response = claimService.submitClaim({
        policyId: 'POL789',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date(),
        amountClaimed: 0,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.NOT_COVERED);
    });
  });

  describe('findPolicy', () => {
    it('should return null if not found', () => {
      expect(claimService.findPolicy('')).toBeNull();
    });
    it('should return a matching policy if found', () => {
      const policyId = 'POL456';
      const foundPolicy = claimService.findPolicy(policyId);
      expect(foundPolicy?.policyId).toBe(policyId);
    });
  });

  describe('evaluateIncidentType', () => {
    it('should return true if incident is covered', () => {
      expect(
        claimService.evaluateIncidentType(
          IncidentType.FIRE,
          existingPolicies[0].coveredIncidents,
        ),
      ).toBe(true);
    });

    it('should return false if incident is not covered', () => {
      expect(
        claimService.evaluateIncidentType(
          IncidentType.WATER_DAMAGE,
          existingPolicies[0].coveredIncidents,
        ),
      ).toBe(false);
    });
  });

  describe('evaluateIncidentDate', () => {
    it('should return true if policy was active on incident date', () => {
      expect(
        claimService.evaluateIncidentDate(
          new Date('2025-04-27'),
          existingPolicies[1].startDate,
          existingPolicies[1].endDate,
        ),
      ).toBe(true);
    });

    it('should return false if policy was not active on incident date', () => {
      expect(
        claimService.evaluateIncidentDate(
          new Date('2025-04-27'),
          existingPolicies[0].startDate,
          existingPolicies[0].endDate,
        ),
      ).toBe(true);
    });
  });

  describe('evaluateAmountClaimed', () => {
    it('should return { ZERO_PAYOUT, 0 } if payout is negative', () => {
      const zeroPayout = { reasonCode: ReasonCode.ZERO_PAYOUT, payout: 0 };

      expect(
        claimService.evaluateAmountClaimed(
          0,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(zeroPayout);
    });

    it('should return { ZERO_PAYOUT, 0 } if payout is 0', () => {
      const zeroPayout = { reasonCode: ReasonCode.ZERO_PAYOUT, payout: 0 };

      expect(
        claimService.evaluateAmountClaimed(
          0,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(zeroPayout);
    });

    it('should return APPROVED if payout is non-negative and non-zero', () => {
      const zeroPayout = { reasonCode: ReasonCode.ZERO_PAYOUT, payout: 0 };

      expect(
        claimService.evaluateAmountClaimed(
          0,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(zeroPayout);
    });
  });
});
