import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { IncidentType } from '../../constants';

export class ClaimSubmissionRequestDto {
  // Policy ID of claimant
  @IsString()
  policyId: string;

  // Type of incident being claimed - One of: [accident, theft, fire, water damage]
  @IsEnum(IncidentType)
  incidentType: IncidentType;

  // Date of incident: Format YYYY-MM-DD
  @IsDateString()
  incidentDate: string;

  // Amount claimed in dollar amount
  @IsInt()
  amountClaimed: number;
}
