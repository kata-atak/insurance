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
          policyId: 'POL456',
          incidentType: IncidentType.ACCIDENT,
          incidentDate: new Date('2025-04-27'),
          amountClaimed: 250,
        }),
      ).toBeInstanceOf(ClaimSubmissionResponseDto);
    });

    it('should respond appropriately when a policy is not found', () => {
      const response = claimService.submitClaim({
        policyId: 'POL789',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date('2025-04-27'),
        amountClaimed: 0,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.POLICY_NOT_FOUND);
    });

    it('should respond appropriately when a policy is not active', () => {
      const response = claimService.submitClaim({
        policyId: 'POL123',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date('2025-04-27'),
        amountClaimed: 0,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.POLICY_INACTIVE);
    });

    it('should respond appropriately when a claimed incident is not covered', () => {
      const response = claimService.submitClaim({
        policyId: 'POL456',
        incidentType: IncidentType.THEFT,
        incidentDate: new Date('2025-04-27'),
        amountClaimed: 0,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.NOT_COVERED);
    });

    it('should respond appropriately when a policy is evaluated to be a negative (zero) payout', () => {
      const response = claimService.submitClaim({
        policyId: 'POL456',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date('2025-04-27'),
        amountClaimed: 150,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.ZERO_PAYOUT);
    });

    it('should respond appropriately when a policy is evaluated to be a zero payout', () => {
      const response = claimService.submitClaim({
        policyId: 'POL456',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date('2025-04-27'),
        amountClaimed: 250,
      });
      expect(response.payout).toEqual(0);
      expect(response.approved).toEqual(false);
      expect(response.reasonCode).toEqual(ReasonCode.ZERO_PAYOUT);
    });

    it('should respond appropriately when a policy is evaluated to be approved', () => {
      const response = claimService.submitClaim({
        policyId: 'POL456',
        incidentType: IncidentType.ACCIDENT,
        incidentDate: new Date('2025-04-27'),
        amountClaimed: 251,
      });
      expect(response.payout).toEqual(1);
      expect(response.approved).toEqual(true);
      expect(response.reasonCode).toEqual(ReasonCode.APPROVED);
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
      ).toBe(false);
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

  describe('evaluateAmountClaimed', () => {
    it('should return { ZERO_PAYOUT, 0 } if payout is negative', () => {
      const zeroPayout = {
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.ZERO_PAYOUT,
      };

      expect(
        claimService.evaluateAmountClaimed(
          150,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(zeroPayout);
    });

    it('should return { ZERO_PAYOUT, 0 } if payout is 0', () => {
      const zeroPayout = {
        approved: false,
        payout: 0,
        reasonCode: ReasonCode.ZERO_PAYOUT,
      };

      expect(
        claimService.evaluateAmountClaimed(
          250,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(zeroPayout);
    });

    it('should return APPROVED if payout is non-negative and non-zero', () => {
      const approvedPayout = {
        approved: true,
        payout: 24750,
        reasonCode: ReasonCode.APPROVED,
      };

      expect(
        claimService.evaluateAmountClaimed(
          25000,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(approvedPayout);
    });

    it('should return APPROVED and payout should be coverage limit if payout is greater than coverage limit', () => {
      const maxPayout = {
        approved: true,
        payout: existingPolicies[1].coverageLimit,
        reasonCode: ReasonCode.APPROVED,
      };

      expect(
        claimService.evaluateAmountClaimed(
          65000,
          existingPolicies[1].deductible,
          existingPolicies[1].coverageLimit,
        ),
      ).toEqual(maxPayout);
    });
  });
});
