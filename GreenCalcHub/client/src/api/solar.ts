import api from './api';

// Description: Get solar panel types
// Endpoint: GET /api/solar/panels
// Request: {}
// Response: { panels: Array<{ id: string, name: string, type: string, efficiency: number, wattage: number, cost: number, isCustom: boolean }> }
export const getSolarPanels = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        panels: [
          { id: '1', name: 'Monocrystalline 400W', type: 'monocrystalline', efficiency: 22.1, wattage: 400, cost: 250, isCustom: false },
          { id: '2', name: 'Polycrystalline 350W', type: 'polycrystalline', efficiency: 19.8, wattage: 350, cost: 200, isCustom: false },
          { id: '3', name: 'Thin Film 300W', type: 'thin-film', efficiency: 16.5, wattage: 300, cost: 150, isCustom: false },
          { id: '4', name: 'Custom Panel A', type: 'custom', efficiency: 24.5, wattage: 450, cost: 300, isCustom: true }
        ]
      });
    }, 500);
  });
};

// Description: Calculate solar energy production
// Endpoint: POST /api/solar/calculate
// Request: { panelId: string, quantity: number, location: string, angle: number, orientation: number, shadingFactor: number }
// Response: { dailyProduction: number, monthlyProduction: number, yearlyProduction: number, peakPower: number, capacityFactor: number, co2Savings: number, financialSavings: number }
export const calculateSolarProduction = (data: { panelId: string, quantity: number, location: string, angle: number, orientation: number, shadingFactor: number }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseProduction = data.quantity * 400 * 5.5; // Basic calculation
      resolve({
        dailyProduction: baseProduction,
        monthlyProduction: baseProduction * 30,
        yearlyProduction: baseProduction * 365,
        peakPower: data.quantity * 400,
        capacityFactor: 0.18,
        co2Savings: baseProduction * 365 * 0.0005,
        financialSavings: baseProduction * 365 * 0.12
      });
    }, 1000);
  });
};