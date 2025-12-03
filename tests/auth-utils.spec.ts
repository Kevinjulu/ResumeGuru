import { authUtils } from '../server/auth';

test('hash and verify password', () => {
  const password = 'secret123';
  const hashed = authUtils.hashPassword(password);
  expect(hashed).toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
  expect(authUtils.verifyPassword(password, hashed)).toBe(true);
  expect(authUtils.verifyPassword('wrong', hashed)).toBe(false);
});
