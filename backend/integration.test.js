const request = require('supertest');

// Mivel a teszt futtatóhoz úgyis futnia kell a backend szervernek, 
// a legegyszerűbb közvetlenül a már futó API-t meghívni!
const API_URL = 'http://localhost:3333';

describe('🔗 API Integrációs Tesztek (Futó szervert igényel!)', () => {
    
    test('GET /api/epiteszek - Visszaadja az építészek listáját (200 OK)', async () => {
        const response = await request(API_URL).get('/api/epiteszek');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/epiteszek - Hibát dob, ha hiányoznak a kötelező adatok (400 Bad Request)', async () => {
        const response = await request(API_URL)
            .post('/api/epiteszek')
            .send({ nev: 'Teszt Elek' }); // Szándékosan hiányos adatok
        
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('A név, stílus, város és épületnév megadása kötelező!');
    });

});