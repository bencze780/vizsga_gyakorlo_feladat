import React, { useState } from 'react';
import { Container, Card, Button, Alert, Accordion } from 'react-bootstrap';

const TestRunner = ({ apiUrl }) => {
    const [output, setOutput] = useState('Kattints egy fenti gombra a tesztelés megkezdéséhez...');
    const [loading, setLoading] = useState(false);

    const runTest = async (type) => {
        setOutput('Futtatás folyamatban... Kérlek várj! \n(Az integrációs tesztek akár 5-10 másodpercet is igénybe vehetnek)');
        setLoading(true);

        try {
            const response = await fetch(`${apiUrl}/run-tests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });

            const contentType = response.headers.get("content-type");
            if (!response.ok || !contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                throw new Error(`A szerver nem megfelelő formátumban (nem JSON) vagy hibával válaszolt.\nStátuszkód: ${response.status}\n\nLehet, hogy nem indítottad újra a backend szervert a server.js módosítása után?\n\nRészletek:\n${text.substring(0, 150)}...`);
            }

            const data = await response.json();
            setOutput(data.output || 'Nincs megjeleníthető kimenet.');
        } catch (error) {
            setOutput('Hiba történt a szerverhez való kapcsolódáskor:\n' + error.message + '\n\nEllenőrizd, hogy a backend szerver fut-e!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="animate__fadeIn mt-4">
            <Card className="p-4 shadow-sm border-0" style={{ borderRadius: '10px' }}>
                <h2 className="mb-3">🧪 Tesztelés (Gyakorló és Vizsgafelkészítő Modul)</h2>

                {/* Oktatási blokk végzősöknek */}
                <Alert variant="info" className="mb-4">
                    <Alert.Heading>🎓 Kedves Végzős Diákok!</Alert.Heading>
                    <p>
                        Ez a felület kifejezetten a szoftverfejlesztő vizsgára való önálló felkészüléseteket segíti. 
                        A backend API tesztelése (<strong>Jest</strong> és <strong>Supertest</strong> keretrendszerekkel) a vizsgakövetelmények szerves része lehet. 
                        Itt valós időben futtathatjátok le a projektben lévő teszteket.
                    </p>
                    <hr />
                    <p className="mb-0 text-dark">
                        💡 <strong>Tanulási tipp:</strong> Futtatás után mindenképp nyissátok meg a kódolvasóban a backend mappa <code>*.test.js</code> kiterjesztésű fájljait, hogy lássátok, hogyan épülnek fel az assert (expect) vizsgálatok!
                    </p>
                </Alert>

                <Accordion className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>📖 Tananyag: Milyen tesztelési szintek léteznek?</Accordion.Header>
                        <Accordion.Body>
                            <ul className="mb-0" style={{ lineHeight: '1.8' }}>
                                <li><strong>Egyszerű Teszt (Sum):</strong> A legalapvetőbb forma. Azt bizonyítja, hogy a tesztkörnyezet megfelelően fut. Szimpla matematikai vagy logikai műveleteket vizsgál. <em>(Lásd: sum.test.js)</em></li>
                                <li><strong>Unit (Egység) Tesztek:</strong> A kód egyetlen, jól elkülöníthető részletét (pl. egy validációs függvényt) vizsgálja. Gyorsan lefut, nem igényel hálózatot vagy adatbázist. <em>(Lásd: unit.test.js)</em></li>
                                <li><strong>Integrációs Tesztek:</strong> Több elem együttes működését vizsgálja. Itt a <code>Supertest</code> segítségével valódi HTTP kéréseket (GET, POST) küldünk az API-nak, ami kommunikál a valós MySQL adatbázissal is. <em>(Lásd: integration.test.js)</em></li>
                                <li><strong>Mockolt Tesztek (Haladó):</strong> Olyan integrációs teszt, ahol az adatbázis kapcsolatot "hamisítjuk" (mockoljuk) a <code>jest.mock()</code> metódussal. Így a tesztelés biztonságos, nem írja felül a valós adatokat, és futó adatbázis-szerver nélkül is működik! <em>(Lásd: mock-integration.test.js)</em></li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>🛠️ Szükséges modulok és telepítésük</Accordion.Header>
                        <Accordion.Body>
                            <p className="mb-2">A tesztek futtatásához a <strong>backend</strong> projektben az alábbi tesztelő csomagokra van szükség:</p>
                            <ul className="mb-3" style={{ lineHeight: '1.8' }}>
                                <li><strong>Jest</strong>: Egy teljes körű JavaScript tesztelő keretrendszer, ő biztosítja az alapvető függvényeket (<code>describe</code>, <code>it</code>/<code>test</code>, <code>expect</code>).</li>
                                <li><strong>Supertest</strong>: Kifejezetten Express/Node.js HTTP szerverek (API végpontok) tesztelésére használt könyvtár.</li>
                            </ul>
                            <p className="mb-1"><strong>Telepítési parancs (a <code>backend</code> mappában, a terminálban kiadva):</strong></p>
                            <pre className="bg-dark text-light p-2 rounded mb-3">
                                <code>npm install --save-dev jest supertest</code>
                            </pre>
                            <p className="mb-0 text-muted small">
                                <em>Tipp: Érdemes a backend <code>package.json</code> fájljában a <code>"scripts"</code> részhez hozzáadni a futtató parancsot (pl. <code>"test": "jest"</code>), ahogy a fenti gombok is használják a háttérben.</em>
                            </p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <p className="text-muted mb-3">Kattints egy gombra az adott tesztcsomag futtatásához a szerveren:</p>

                <div className="d-flex flex-wrap gap-3 mb-4">
                    <Button variant="primary" onClick={() => runTest('sum')} disabled={loading}>Egyszerű Teszt (Sum)</Button>
                    <Button variant="info" className="text-white" onClick={() => runTest('unit')} disabled={loading}>Unit Tesztek</Button>
                    <Button variant="secondary" onClick={() => runTest('integration')} disabled={loading}>Integrációs Tesztek</Button>
                    <Button variant="warning" onClick={() => runTest('mock')} disabled={loading}>Mockolt Tesztek</Button>
                    <Button variant="success" onClick={() => runTest('all')} disabled={loading}>Összes Teszt Futtatása</Button>
                </div>

                <pre style={{
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '20px',
                    borderRadius: '8px',
                    overflowX: 'auto',
                    minHeight: '300px',
                    whiteSpace: 'pre-wrap',
                    fontFamily: "'Courier New', Courier, monospace",
                    lineHeight: '1.5'
                }}>
                    {output}
                </pre>
            </Card>
        </Container>
    );
};

export default TestRunner;