import { Test, TestingModule } from '@nestjs/testing';
import { ClaimController } from '../claim.controller';
import { ClaimService } from '../claim.service';
import { IncidentType } from '../constants';
import { ClaimSubmissionResponseDto } from '../dto/response/claim.dto';

describe('ClaimController', () => {
  let claimController: ClaimController;

  beforeEach(async () => {
    const claim: TestingModule = await Test.createTestingModule({
      controllers: [ClaimController],
      providers: [ClaimService],
    }).compile();

    claimController = claim.get<ClaimController>(ClaimController);
  });

  describe('submitClaim', () => {
    it('should return correct DTO', () => {
      expect(
        claimController.submitClaim({
          policyId: '',
          incidentType: IncidentType.ACCIDENT,
          incidentDate: '',
          amountClaimed: 0,
        }),
      ).toBeInstanceOf(ClaimSubmissionResponseDto);
    });
  });
});
