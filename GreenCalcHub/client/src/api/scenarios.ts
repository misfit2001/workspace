import api from './api';

// Description: Get scenario history for the current user
// Endpoint: GET /api/scenarios
// Request: {}
// Response: { scenarios: Array<{ id: string, name: string, type: string, location: string, date: string, energy: number, cost: number, co2Savings: number }> }
export const getScenarioHistory = () => {
    // Mocking the response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                scenarios: [
                    { id: '1', name: 'Athens Solar Farm', type: 'Solar', location: 'Athens', date: '2024-01-15', energy: 125000, cost: 85000, co2Savings: 62.5 },
                    { id: '2', name: 'Thessaloniki Wind Park', type: 'Wind', location: 'Thessaloniki', date: '2024-01-14', energy: 180000, cost: 120000, co2Savings: 90.0 },
                    { id: '3', name: 'Crete Combined System', type: 'Combined', location: 'Crete', date: '2024-01-13', energy: 250000, cost: 180000, co2Savings: 125.0 },
                    { id: '4', name: 'Rhodes Hydro Plant', type: 'Hydro', location: 'Rhodes', date: '2024-01-12', energy: 95000, cost: 65000, co2Savings: 47.5 },
                    { id: '5', name: 'Mykonos Desalination', type: 'Desalination', location: 'Mykonos', date: '2024-01-11', energy: 75000, cost: 95000, co2Savings: 37.5 }
                ]
            });
        }, 800);
    });
    // Uncomment the below lines to make an actual API call
    // try {
    //   return await api.get('/api/scenarios');
    // } catch (error) {
    //   throw new Error(error?.response?.data?.error || error.message);
    // }
};

// Description: Save a new scenario
// Endpoint: POST /api/scenarios
// Request: { name: string, type: string, location: string, configuration: object, results: object }
// Response: { success: boolean, message: string, scenarioId: string }
export const saveScenario = (data: { name: string; type: string; location: string; configuration: object; results: object }) => {
    // Mocking the response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Scenario saved successfully',
                scenarioId: `scenario_${Date.now()}`
            });
        }, 1000);
    });
    // Uncomment the below lines to make an actual API call
    // try {
    //   return await api.post('/api/scenarios', data);
    // } catch (error) {
    //   throw new Error(error?.response?.data?.error || error.message);
    // }
};

// Description: Delete a scenario by ID
// Endpoint: DELETE /api/scenarios/:id
// Request: { id: string }
// Response: { success: boolean, message: string }
export const deleteScenario = (id: string) => {
    // Mocking the response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Scenario deleted successfully'
            });
        }, 500);
    });
    // Uncomment the below lines to make an actual API call
    // try {
    //   return await api.delete(`/api/scenarios/${id}`);
    // } catch (error) {
    //   throw new Error(error?.response?.data?.error || error.message);
    // }
};

// Description: Calculate comprehensive scenario with all producer configurations
// Endpoint: POST /api/scenarios/calculate
// Request: { name: string, location: string, population: number, duration: number, producers: object, storage: object, consumers: object }
// Response: { totalProduction: number, totalConsumption: number, balance: number, storageCapacity: number, co2Savings: number, financialSavings: number, solarDetails: object, windDetails: object, hydroDetails: object, equipmentCosts: object }
export const calculateScenario = (data: any) => {
    // Mocking the response
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockResults = {
                totalProduction: data.producers.solarPanels * 400 * 365 + data.producers.windTurbines * 2000000 + data.producers.hydroTurbines * 1000000,
                totalConsumption: data.consumers.buildings * 3000 + data.consumers.evChargers * 50000 + data.consumers.desalinationPlant * 1000000,
                balance: 0,
                storageCapacity: (data.storage.batteries * 100) + (data.storage.hydrogenStorage * 1000),
                co2Savings: 0,
                financialSavings: 0,
                solarDetails: data.producers.solarConfig ? {
                    panels: data.producers.solarPanels,
                    efficiency: data.producers.solarConfig.efficiency || 20,
                    angle: data.producers.solarConfig.angle || 30,
                    production: data.producers.solarPanels * 400 * 365
                } : null,
                windDetails: data.producers.windConfig ? {
                    turbines: data.producers.windTurbines,
                    power: data.producers.windConfig.power || 2000000,
                    hubHeight: data.producers.windConfig.hubHeight || 80,
                    production: data.producers.windTurbines * 2000000
                } : null,
                hydroDetails: data.producers.hydroConfig ? {
                    units: data.producers.hydroTurbines,
                    efficiency: data.producers.hydroConfig.efficiency || 0.85,
                    head: data.producers.hydroConfig.head || 50,
                    flow: data.producers.hydroConfig.flow || 2.0,
                    production: data.producers.hydroTurbines * 1000000
                } : null,
                equipmentCosts: {
                    solar: data.producers.solarPanels * (data.producers.solarConfig?.cost || 500),
                    wind: data.producers.windTurbines * (data.producers.windConfig?.cost || 1500000),
                    hydro: data.producers.hydroTurbines * (data.producers.hydroConfig?.cost || 800000)
                }
            };
            
            mockResults.balance = mockResults.totalProduction - mockResults.totalConsumption;
            mockResults.co2Savings = mockResults.totalProduction * 0.0005;
            mockResults.financialSavings = mockResults.balance * 0.12;
            
            resolve(mockResults);
        }, 2000);
    });
    // Uncomment the below lines to make an actual API call
    // try {
    //   return await api.post('/api/scenarios/calculate', data);
    // } catch (error) {
    //   throw new Error(error?.response?.data?.error || error.message);
    // }
};