const sum = require('./sum');

describe('Egyszerű Sum Tesztek', () => {
    test('összeadja az 1 + 2-t, hogy 3-at kapjunk', () => {
        expect(sum(1, 2)).toBe(3);
    });

    test('összeadja a 10 + 5-öt, hogy 15-öt kapjunk', () => {
        expect(sum(10, 5)).toBe(15);
    });
});