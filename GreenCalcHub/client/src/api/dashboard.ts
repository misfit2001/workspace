import api from './api';

// Description: Get dashboard overview data including stats and recent calculations
// Endpoint: GET /api/dashboard/overview
// Request: {}
// Response: { stats: { savedScenarios: number, totalEnergy: number, co2Savings: number }, recentCalculations: Array<{ id: string, type: string, location: string, date: string, energy: number }>, weather: { location: string, temperature: number, condition: string, windSpeed: number } }
export const getDashboardOverview = () => {
    // Mocking the response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                stats: {
                    savedScenarios: 12,
                    totalEnergy: 45600,
                    co2Savings: 23.8
                },
                recentCalculations: [
                    { id: '1', type: 'Solar', location: 'Athens', date: '2024-01-15', energy: 12500 },
                    { id: '2', type: 'Wind', location: 'Thessaloniki', date: '2024-01-14', energy: 18200 },
                    { id: '3', type: 'Combined', location: 'Crete', date: '2024-01-13', energy: 25800 },
                    { id: '4', type: 'Solar', location: 'Patras', date: '2024-01-12', energy: 9600 }
                ],
                weather: {
                    location: 'Athens',
                    temperature: 18,
                    condition: 'Sunny',
                    windSpeed: 12
                }
            });
        }, 500);
    });
    // Uncomment the below lines to make an actual API call
    // try {
    //   return await api.get('/api/dashboard/overview');
    // } catch (error) {
    //   throw new Error(error?.response?.data?.error || error.message);
    // }
};

// Description: Get list of Greek regions with energy data
// Endpoint: GET /api/regions/greece
// Request: {}
// Response: { regions: Array<{ id: string, name: string, nameEn: string, coordinates: [number, number], solarIrradiance: number, windSpeed: number, elevation: number }> }
export const getGreekRegions = () => {
    // Mocking the response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                regions: [
                    {
                        id: '1',
                        name: 'Αθήνα',
                        nameEn: 'Athens',
                        coordinates: [37.9838, 23.7275],
                        solarIrradiance: 1650,
                        windSpeed: 8.5,
                        elevation: 170
                    },
                    {
                        id: '2',
                        name: 'Θεσσαλονίκη',
                        nameEn: 'Thessaloniki',
                        coordinates: [40.6401, 22.9444],
                        solarIrradiance: 1580,
                        windSpeed: 9.2,
                        elevation: 40
                    },
                    {
                        id: '3',
                        name: 'Κρήτη',
                        nameEn: 'Crete',
                        coordinates: [35.2401, 24.8093],
                        solarIrradiance: 1750,
                        windSpeed: 11.8,
                        elevation: 250
                    },
                    {
                        id: '4',
                        name: 'Πάτρα',
                        nameEn: 'Patras',
                        coordinates: [38.2466, 21.7346],
                        solarIrradiance: 1620,
                        windSpeed: 7.9,
                        elevation: 50
                    },
                    {
                        id: '5',
                        name: 'Ρόδος',
                        nameEn: 'Rhodes',
                        coordinates: [36.4341, 28.2176],
                        solarIrradiance: 1820,
                        windSpeed: 13.2,
                        elevation: 120
                    },
                    {
                        id: '6',
                        name: 'Μύκονος',
                        nameEn: 'Mykonos',
                        coordinates: [37.4467, 25.3289],
                        solarIrradiance: 1780,
                        windSpeed: 15.6,
                        elevation: 80
                    },
                    {
                        id: '7',
                        name: 'Σαντορίνη',
                        nameEn: 'Santorini',
                        coordinates: [36.3932, 25.4615],
                        solarIrradiance: 1850,
                        windSpeed: 14.3,
                        elevation: 200
                    },
                    {
                        id: '8',
                        name: 'Κέρκυρα',
                        nameEn: 'Corfu',
                        coordinates: [39.6243, 19.9217],
                        solarIrradiance: 1520,
                        windSpeed: 8.1,
                        elevation: 90
                    }
                ]
            });
        }, 300);
    });
    // Uncomment the below lines to make an actual API call
    // try {
    //   return await api.get('/api/regions/greece');
    // } catch (error) {
    //   throw new Error(error?.response?.data?.error || error.message);
    // }
};