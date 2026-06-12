// TODO: Run `npm install axios` to install Axios and configure it here.
// For now, this is a mock wrapper to prevent TypeScript errors.

export const axiosInstance = {
  get: async <T>(url: string, config?: any): Promise<{ data: T }> => {
    console.log(`[Mock Axios GET] ${url}`);
    return { data: {} as T };
  },
  post: async <T>(url: string, data?: any, config?: any): Promise<{ data: T }> => {
    console.log(`[Mock Axios POST] ${url}`, data);
    return { data: {} as T };
  },
  put: async <T>(url: string, data?: any, config?: any): Promise<{ data: T }> => {
    console.log(`[Mock Axios PUT] ${url}`, data);
    return { data: {} as T };
  },
  delete: async <T>(url: string, config?: any): Promise<{ data: T }> => {
    console.log(`[Mock Axios DELETE] ${url}`);
    return { data: {} as T };
  },
};

export default axiosInstance;
