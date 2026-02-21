import api from './axios';

/**
 * Fetch drivers from the backend.
 * @param {Object} [params] - Optional query parameters (e.g. { status: 'on_duty' })
 * @returns {Promise<Array>} List of driver objects
 */
export async function getDrivers(params = {}) {
    const response = await api.get('/api/drivers/', { params });
    // DRF paginated response returns { results: [...] } or plain array
    return response.data.results ?? response.data;
}

export async function getOnDutyDrivers() {
    const response = await api.get('/api/drivers/on_duty/');
    return response.data;
}
