const jwt = require('jsonwebtoken');
const TokenCache = require('./tokenCache');

describe('Test TokenCache constructor options', () => {
    test('It should use default expDistance', async () => {
        const tc = new TokenCache();
        expect(tc).not.toBe(null);
        expect(tc._expDistance).toBe(1000*5*60);
    });

    test('It should use provided expDistance', async () => {
        const tc = new TokenCache(1000);
        expect(tc._expDistance).toBe(1000);
    });
});

describe('Test TokenCache get', () => {
    test('It should return null with no set token', async () => {
        const tc = new TokenCache();

        expect(tc.get()).toBe(null);
    });
})

describe('Test TokenCache.set', () => {
  test('It should fail with invalid token', async () => {
      const tc = new TokenCache();

      expect(() => { tc.set("invalidJWT") }).toThrow('Invalid JWT token');
  });
})