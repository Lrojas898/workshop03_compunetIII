import { vi } from 'vitest';

export const createAxiosMock = () => ({
  get: vi.fn(() => Promise.resolve({ data: {} })),
  post: vi.fn(() => Promise.resolve({ data: {} })),
  put: vi.fn(() => Promise.resolve({ data: {} })),
  delete: vi.fn(() => Promise.resolve({ data: {} })),
  patch: vi.fn(() => Promise.resolve({ data: {} })),
  create: vi.fn(function() { return this; }),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
    },
  },
  defaults: {
    headers: {
      common: {},
    },
  },
});

export const mockAxios = createAxiosMock();
