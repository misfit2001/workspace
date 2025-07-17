import api from './api';

// Description: Get custom technologies
// Endpoint: GET /api/technology/custom
// Request: {}
// Response: { technologies: { solar: Array<any>, wind: Array<any>, hydro: Array<any> } }
export const getCustomTechnologies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        technologies: {
          solar: [
            { id: '1', name: 'Custom Panel A', efficiency: 24.5, wattage: 450, cost: 300, uploadDate: '2024-01-10' },
            { id: '2', name: 'Custom Panel B', efficiency: 23.8, wattage: 420, cost: 280, uploadDate: '2024-01-08' }
          ],
          wind: [
            { id: '1', name: 'Custom Turbine X', power: 2500, hubHeight: 90, rotorDiameter: 120, cost: 1600000, uploadDate: '2024-01-12' }
          ],
          hydro: [
            { id: '1', name: 'Custom Micro-Hydro', efficiency: 0.85, maxFlow: 1.2, maxHead: 50, cost: 150000, uploadDate: '2024-01-05' }
          ]
        }
      });
    }, 500);
  });
};

// Description: Upload custom technology CSV
// Endpoint: POST /api/technology/upload
// Request: { file: File, type: string }
// Response: { success: boolean, message: string, count: number }
export const uploadCustomTechnology = (data: { file: File, type: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Technology data uploaded successfully',
        count: 5
      });
    }, 2000);
  });
};

// Description: Delete custom technology
// Endpoint: DELETE /api/technology/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCustomTechnology = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Technology deleted successfully'
      });
    }, 500);
  });
};

// Description: Download CSV template
// Endpoint: GET /api/technology/template/:type
// Request: {}
// Response: Blob
export const downloadTemplate = (type: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const csvContent = type === 'solar' 
        ? 'name,efficiency,wattage,cost\nSample Panel,22.5,400,250'
        : type === 'wind'
        ? 'name,power,hubHeight,rotorDiameter,cost\nSample Turbine,2000,80,90,1200000'
        : 'name,efficiency,maxFlow,maxHead,cost\nSample Hydro,0.85,2.5,100,300000';
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      resolve(blob);
    }, 500);
  });
};