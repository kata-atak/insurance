//'accident' | 'theft' | 'fire' | 'water damage';

export enum IncidentType {
  ACCIDENT = 'accident',
  THEFT = 'theft',
  FIRE = 'fire',
  WATER_DAMAGE = 'water damage',
}

export enum ReasonCode {
  APPROVED = 'APPROVED',
  POLICY_INACTIVE = 'POLICY_INACTIVE',
  POLICY_NOT_FOUND = 'POLICY_NOT_FOUND',
  NOT_COVERED = 'NOT_COVERED',
  ZERO_PAYOUT = 'ZERO_PAYOUT',
}
