// Egy egyszerű unit teszt példa, ami nem igényel szervert vagy adatbázist
describe('⚡ Unit Tesztek - Adat validáció', () => {
    
    // Szimuláljuk egy belső validációs függvény működését
    const validateEpitesz = (data) => {
        if (!data.nev || !data.stilus || !data.varos || !data.epulet_nev) {
            return false;
        }
        return true;
    };

    test('Érvényes adatok esetén a validáció átmegy (true)', () => {
        const validData = { nev: 'Ybl Miklós', stilus: 'Neoreneszánsz', varos: 'Budapest', epulet_nev: 'Operaház' };
        expect(validateEpitesz(validData)).toBe(true);
    });

    test('Hiányzó adatok esetén a validáció elbukik (false)', () => {
        const invalidData = { nev: 'Hiányos Építész' };
        expect(validateEpitesz(invalidData)).toBe(false);
    });
});