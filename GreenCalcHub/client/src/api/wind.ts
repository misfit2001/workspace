import api from './api';

// Description: Get wind turbine types
// Endpoint: GET /api/wind/turbines
// Request: {}
// Response: { turbines: Array<{ id: string, name: string, power: number, hubHeight: number, rotorDiameter: number, cost: number, isCustom: boolean }> }
export const getWindTurbines = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        turbines: [
          { id: '1', name: 'Vestas V90-2.0MW', power: 2000, hubHeight: 80, rotorDiameter: 90, cost: 1200000, isCustom: false },
          { id: '2', name: 'Siemens SWT-2.3-108', power: 2300, hubHeight: 80, rotorDiameter: 108, cost: 1400000, isCustom: false },
          { id: '3', name: 'GE 1.5MW', power: 1500, hubHeight: 65, rotorDiameter: 77, cost: 900000, isCustom: false },
          { id: '4', name: 'Custom Turbine X', power: 2500, hubHeight: 90, rotorDiameter: 120, cost: 1600000, isCustom: true }
        ]
      });
    }, 500);
  });
};

// Description: Calculate wind energy production
// Endpoint: POST /api/wind/calculate
// Request: { turbineId: string, quantity: number, location: string, hubHeight: number }
// Response: { dailyProduction: number, monthlyProduction: number, yearlyProduction: number, capacityFactor: number, co2Savings: number, financialSavings: number }
export const calculateWindProduction = (data: { turbineId: string, quantity: number, location: string, hubHeight: number }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseProduction = data.quantity * 2000 * 8; // Basic calculation
      resolve({
        dailyProduction: baseProduction,
        monthlyProduction: baseProduction * 30,
        yearlyProduction: baseProduction * 365,
        capacityFactor: 0.35,
        co2Savings: baseProduction * 365 * 0.0005,
        financialSavings: baseProduction * 365 * 0.12
      });
    }, 1000);
  });
};