const request = require('supertest');
const mysql = require('mysql2');

// 1. A mysql2 modul mockolása még azelőtt, hogy a server.js betöltődne
jest.mock('mysql2', () => {
    const mPoolPromise = {
        query: jest.fn()
    };
    const mPool = {
        promise: jest.fn(() => mPoolPromise)
    };
    return {
        createPool: jest.fn(() => mPool)
    };
});

// 2. Express alkalmazás betöltése (a módosított server.js-ből)
const app = require('./server');

describe('🛠️ Mockolt Integrációs Tesztek (Adatbázis nélkül)', () => {
    let mockQuery;

    beforeAll(() => {
        // Kinyerjük a mockolt query függvényt, hogy beállíthassuk a kimeneteit a tesztekben
        mockQuery = mysql.createPool().promise().query;
    });

    beforeEach(() => {
        jest.clearAllMocks(); // Minden teszt előtt nullázzuk a korábbi DB hívásokat
    });

    test('GET /api/epiteszek - Visszaadja a mockolt adatokat (200 OK)', async () => {
        // Ezeket az adatokat fogja az Express app a MySQL-től kapottnak hinni
        const mockData = [
            { id: 1, nev: 'Mock Építész', szulev: 1800, stilus: 'Teszt' }
        ];
        
        // A szerver kód "const [rows] = await db.query()" logikát használ, ezért tömbbe csomagoljuk
        mockQuery.mockResolvedValue([mockData]);

        const response = await request(app).get('/api/epiteszek');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
        expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM epitesz');
    });

    test('POST /api/epiteszek - Hiba, ha hiányoznak adatok (Nincs DB hívás)', async () => {
        const response = await request(app)
            .post('/api/epiteszek')
            .send({ nev: 'Hiányos Elek' });

        expect(response.status).toBe(400);
        expect(mockQuery).not.toHaveBeenCalled(); // Validáció miatt nem is szabad a DB-t hívnia
    });

    test('POST /api/epiteszek - Sikeres mentés mockolt adatbázisba', async () => {
        // A három egymás után lefutó INSERT lekérdezés hamisítása
        mockQuery
            .mockResolvedValueOnce([{ insertId: 10 }]) // 1. epitesz insert
            .mockResolvedValueOnce([{ insertId: 20 }]) // 2. epulet insert
            .mockResolvedValueOnce([{ insertId: 30 }]);// 3. kapcsolat insert

        const response = await request(app)
            .post('/api/epiteszek')
            .send({ nev: 'Teszt Építész', stilus: 'Modern', varos: 'Pécs', epulet_nev: 'Teszt Ház' });

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(10);
        expect(mockQuery).toHaveBeenCalledTimes(3); // Biztosítjuk, hogy tényleg 3x hívta meg a DB-t
    });
});