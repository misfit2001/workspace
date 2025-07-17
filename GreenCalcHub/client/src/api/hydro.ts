import api from './api';

// Description: Get hydro equipment types
// Endpoint: GET /api/hydro/equipment
// Request: {}
// Response: { equipment: Array<{ id: string, name: string, type: string, efficiency: number, maxFlow: number, maxHead: number, cost: number, isCustom: boolean }> }
export const getHydroEquipment = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        equipment: [
          { id: '1', name: 'Pelton Wheel 500kW', type: 'pelton', efficiency: 0.92, maxFlow: 2.5, maxHead: 300, cost: 400000, isCustom: false },
          { id: '2', name: 'Francis Turbine 1MW', type: 'francis', efficiency: 0.90, maxFlow: 8.0, maxHead: 150, cost: 600000, isCustom: false },
          { id: '3', name: 'Kaplan Turbine 2MW', type: 'kaplan', efficiency: 0.88, maxFlow: 25.0, maxHead: 30, cost: 800000, isCustom: false },
          { id: '4', name: 'Custom Micro-Hydro', type: 'custom', efficiency: 0.85, maxFlow: 1.2, maxHead: 50, cost: 150000, isCustom: true }
        ]
      });
    }, 500);
  });
};

// Description: Calculate hydro energy production
// Endpoint: POST /api/hydro/calculate
// Request: { equipmentId: string, head: number, flow: number, location: string }
// Response: { dailyProduction: number, monthlyProduction: number, yearlyProduction: number, efficiency: number, co2Savings: number, financialSavings: number }
export const calculateHydroProduction = (data: { equipmentId: string, head: number, flow: number, location: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseProduction = data.head * data.flow * 9.81 * 0.85 * 24; // P = ρ * g * h * Q * η * hours
      resolve({
        dailyProduction: baseProduction,
        monthlyProduction: baseProduction * 30,
        yearlyProduction: baseProduction * 365,
        efficiency: 0.85,
        co2Savings: baseProduction * 365 * 0.0005,
        financialSavings: baseProduction * 365 * 0.12
      });
    }, 1000);
  });
};