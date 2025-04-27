import { IncidentType } from '../constants';
import { Policy } from '../interfaces';

// Mocked DB Records
export const existingPolicies: Policy[] = [
  {
    policyId: 'POL123',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    deductible: 500,
    coverageLimit: 10000,
    coveredIncidents: [IncidentType.ACCIDENT, IncidentType.FIRE],
  },
  {
    policyId: 'POL456',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-06-01'),
    deductible: 250,
    coverageLimit: 50000,
    coveredIncidents: [
      IncidentType.ACCIDENT,
      IncidentType.THEFT,
      IncidentType.FIRE,
      IncidentType.WATER_DAMAGE,
    ],
  },
];
