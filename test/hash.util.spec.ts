// Mock para el import dinámico de bcryptjs
beforeAll(() => {
  jest.mock('bcryptjs', () => ({
  hash: async (password: string, salt: number) => `hashed_${password}`,
  compare: jest.fn(),
}));
});

import { hashPassword } from '../src/utils/hash.util';



// Mock bcryptjs module

describe('hashPassword util', () => {
      

  it('should return a hash string', async () => {
    jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
    const hash = await hashPassword('test123', 1); 
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe('test123');
  });
});
