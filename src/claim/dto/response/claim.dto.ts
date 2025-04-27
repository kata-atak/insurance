export class ClaimSubmissionResponseDto {
  // Claim approval status
  approved: boolean;

  // Payout Amount: If payout is zero or negative returns 0
  payout: number;

  //Reason for decision - One of: APPROVED, POLICY_INACTIVE, NOT_COVERED, ZERO_PAYOUT
  reasonCode: string;
}
