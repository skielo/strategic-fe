//import { getAccessToken } from './auth';
//
//// Helper function to add authentication token to API requests
//export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//  const token = await getAccessToken();
//  
//  if (!token) {
//    throw new Error('No authentication token available');
//  }
//
//  const headers = new Headers(options.headers || {});
//  headers.set('Authorization', `Bearer ${token}`);
//
//  return fetch(url, {
//    ...options,
//    headers,
//  });
//};
// src/utils/api.ts
interface FetchOptions extends RequestInit {
  token?: string;
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  try {
    // Get token from localStorage or your auth context
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No authentication token found');
    }

    // Prepare headers with authentication
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {})
    });

    // Make the authenticated request
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Add this line
      headers,
      mode: 'cors', // Add this line
    });

    // Handle different response statuses
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Unauthorized access');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
