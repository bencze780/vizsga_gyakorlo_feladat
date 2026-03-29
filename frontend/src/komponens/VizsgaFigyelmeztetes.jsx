import React, { useState } from 'react';
import { Alert, Container, Button, Offcanvas } from 'react-bootstrap';

const VizsgaFigyelmeztetes = () => {
  const [showDocs, setShowDocs] = useState(false);
  const [activeTab, setActiveTab] = useState('projekt');

  return (
    <>
      <Container className="form-card mb-4 animate__fadeIn" style={{ borderLeft: '5px solid #ffc107' }}>
        <h4 className="text-danger fw-bold text-center mb-3">
          ⚠️ GYAKORLÓ ÜZEMMÓD ⚠️
        </h4>
        <div className="text-muted text-center mb-3">
          Ez a blokk csak a gyakorlást segíti, <strong>NEM a vizsgafeladat része!</strong>
        </div>
        
        <div className="bg-light p-3 rounded mb-3 border">
          <p className="mb-2">
            A minta alkalmazás az összes lehetséges vizsga-technológiát tartalmazza. A vizsgán <strong>nem fog mindegyik kelleni egyszerre</strong>, de a pontos feladat előre nem ismert.
          </p>
          <ul className="mb-0">
            <li><strong>Backend:</strong> Express.js, MySQL2, Multer</li>
            <li><strong>Frontend:</strong> React, Bootstrap</li>
            <li><strong>API Végpontok:</strong> GET, POST, PUT, DELETE</li>
          </ul>
        </div>

        <div className="text-center" style={{ marginTop: '1rem' }}>
          <Alert variant="warning" className="mb-3 text-dark shadow-sm">
            💡 <strong>Tipp:</strong> Úgy gyakoroljatok, hogy <strong>MI segítsége nélkül is</strong> meglegyen a vizsga! A legfőbb szempont az elvárt <strong>funkcionalitás</strong> biztosítása.
          </Alert>
          
          <Button 
            variant="primary" 
            size="lg"
            style={{
              display: 'block',
              margin: '2rem auto',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              maxWidth: '400px'
            }}
            onClick={() => setShowDocs(true)}
          >
            📖 Olvasd tovább - Teljes dokumentáció
          </Button>
        </div>
      </Container>

      {/* Offcanvas Dokumentáció */}
      <Offcanvas 
        show={showDocs} 
        onHide={() => setShowDocs(false)} 
        placement="end"
        style={{ width: '70%' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>📚 ÉpítészArchívum - Teljes Dokumentáció</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ overflowY: 'auto', fontSize: '0.95rem' }}>
          {/* Tab gombok */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            <Button 
              variant={activeTab === 'projekt' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setActiveTab('projekt')}
            >
              🏗️ Projekt
            </Button>
            <Button 
              variant={activeTab === 'backend' ? 'success' : 'outline-success'}
              size="sm"
              onClick={() => setActiveTab('backend')}
            >
              🔧 Backend API
            </Button>
            <Button 
              variant={activeTab === 'frontend' ? 'info' : 'outline-info'}
              size="sm"
              onClick={() => setActiveTab('frontend')}
            >
              ⚛️ Frontend
            </Button>
          </div>

          {/* PROJEKT TAB */}
          {activeTab === 'projekt' && (
            <div className="animate__animated animate__fadeIn">
              <h4 className="text-primary border-bottom pb-2 mb-3">🏗️ ÉpítészArchívum - Projekt</h4>
              <p>Egy modern webes alkalmazás az építészek, épületek és építészetti stílusok nyilvántartásához képkezelés funkcióval.</p>
              
              <h5 className="mt-4 text-secondary">📋 Projekt Célja</h5>
              <ul className="mb-4">
                <li>📚 <strong>Építészek adatainak nyilvántartása</strong> (név, születési év, stílus)</li>
                <li>🏢 <strong>Épületek és szobrok katalógusa</strong> (név, város, építési év)</li>
                <li>🖼️ <strong>Képek felhasználása</strong> és nyilvántartása az épületekhez</li>
                <li>🔗 <strong>Kapcsolatok kezelése</strong> az építészek és épületek között (Many-to-Many)</li>
              </ul>

              <h5 className="mt-4 text-secondary">🛠️ Technológiai Stack</h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered table-sm align-middle">
                  <thead className="table-light">
                    <tr><th>Terület</th><th>Technológia</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><strong>Backend</strong></td><td>Node.js + Express 5.2.1</td></tr>
                    <tr><td><strong>Frontend</strong></td><td>React 19.2.4 + Vite 8.0.1</td></tr>
                    <tr><td><strong>Adatbázis</strong></td><td>MySQL 8.0.40</td></tr>
                    <tr><td><strong>UI Framework</strong></td><td>React-Bootstrap 2.10.10</td></tr>
                    <tr><td><strong>Képfeltöltés</strong></td><td>Multer 2.1.1</td></tr>
                  </tbody>
                </table>
              </div>

              <h5 className="mt-4 text-secondary">🗄️ Adatbázis Szerkezete</h5>
              <div className="bg-light p-3 rounded border mb-4">
                <p className="mb-1"><strong>epitesz (Építészek)</strong></p>
                <pre className="text-muted small"><code>id INT PK, nev VARCHAR(100), szulev INT, stilus VARCHAR(100)</code></pre>
                
                <p className="mb-1 mt-3"><strong>epulet (Épületek)</strong></p>
                <pre className="text-muted small"><code>id INT PK, nev VARCHAR(100), varos VARCHAR(100), epult INT, kep_url VARCHAR(255)</code></pre>
                
                <p className="mb-1 mt-3"><strong>kapcsolat (Kapcsolótábla)</strong></p>
                <pre className="text-muted small mb-0"><code>epulet_id INT FK, epitesz_id INT FK</code></pre>
              </div>

              <h5 className="mt-4 text-secondary">🚀 Telepítés és Indítás</h5>
              <pre className="bg-dark text-white p-3 rounded"><code>{`# 1. Adatbázis importálása
mysql -u root -p < epiteszek.sql

# 2. Backend indítása (http://localhost:3333)
cd backend && npm install && npm start

# 3. Frontend indítása (http://localhost:5173)
cd frontend && npm install && npm run dev`}</code></pre>

              <h5 className="mt-4 text-secondary">🎓 Tanulási Célok</h5>
              <ul className="list-unstyled mb-0">
                <li>✅ Backend: Express.js REST API fejlesztés</li>
                <li>✅ Frontend: React komponens-alapú fejlesztés</li>
                <li>✅ Adatbázis: MySQL queries, relációs adatmodell</li>
                <li>✅ Fájlkezelés: Multer képfeltöltés</li>
              </ul>
            </div>
          )}

          {/* BACKEND TAB */}
          {activeTab === 'backend' && (
            <div className="animate__animated animate__fadeIn">
              <h4 className="text-success border-bottom pb-2 mb-3">🔧 Backend API (Express.js)</h4>
              <p>Node.js szerver az ÉpítészArchívum alkalmazáshoz. Kezeli az adatbázis műveleteket és a képfeltöltéseket (Multer).</p>

              <h5 className="mt-4 text-secondary">📡 API Végpontok (Routes)</h5>
              
              <div className="mb-3 border-start border-4 border-info ps-3">
                <strong><span className="badge bg-primary">GET</span> /api/epuletek</strong>
                <p className="mb-1 text-muted small">Összes épület listázása a hozzájuk tartozó építész nevével (JOIN).</p>
              </div>

              <div className="mb-3 border-start border-4 border-info ps-3">
                <strong><span className="badge bg-primary">GET</span> /api/epiteszek</strong>
                <p className="mb-1 text-muted small">Összes építész alapadatainak lekérése.</p>
              </div>

              <div className="mb-3 border-start border-4 border-info ps-3">
                <strong><span className="badge bg-primary">GET</span> /api/images-list</strong>
                <p className="mb-1 text-muted small">A <code>public/kepek/</code> mappában lévő fizikai képfájlok listája.</p>
              </div>

              <div className="mb-3 border-start border-4 border-success ps-3">
                <strong><span className="badge bg-success">POST</span> /api/epiteszek</strong>
                <p className="mb-1 text-muted small">Új építész (és egyben az első épülete) hozzáadása JSON formátumban.</p>
                <pre className="bg-light p-2 rounded border small mb-0"><code>{`{ "nev": "Ybl Miklós", "stilus": "Neoreneszánsz", "varos": "Budapest", "epulet_nev": "Operaház" }`}</code></pre>
              </div>

              <div className="mb-3 border-start border-4 border-success ps-3">
                <strong><span className="badge bg-success">POST</span> /api/upload</strong>
                <p className="mb-1 text-muted small">Kép feltöltése (multipart/form-data). Max méret: 5 MB (JPG, PNG, WebP).</p>
              </div>

              <div className="mb-3 border-start border-4 border-warning ps-3">
                <strong><span className="badge bg-warning text-dark">PUT</span> /api/epuletek/:id</strong>
                <p className="mb-1 text-muted small">Meglévő épület adatainak módosítása (név, város, épült).</p>
              </div>

              <div className="mb-3 border-start border-4 border-warning ps-3">
                <strong><span className="badge bg-warning text-dark">PUT</span> /api/epuletek/:id/kep</strong>
                <p className="mb-1 text-muted small">Feltöltött kép URL-jének hozzárendelése egy adott épülethez.</p>
              </div>

              <div className="mb-3 border-start border-4 border-danger ps-3">
                <strong><span className="badge bg-danger">DELETE</span> /api/epuletek/:id</strong>
                <p className="mb-1 text-muted small">Kép URL törlése az épületről (mező NULL-ra állítása).</p>
              </div>

              <h5 className="mt-4 text-secondary">⚙️ Biztonság és Részletek</h5>
              <ul className="small text-muted">
                <li><strong>MySQL Beállítás:</strong> <code>host: localhost, user: root, pw: root, port: 3307 / 3306</code></li>
                <li><strong>Multer:</strong> Képek mentése a <code>backend/public/kepek/</code> könyvtárba.</li>
                <li><strong>CORS:</strong> Engedélyezve a külső (frontend) böngészős lekérésekhez.</li>
                <li><strong>Hiba kezelés:</strong> Minden végpont Error Handling-et tartalmaz (<code>try...catch</code>).</li>
              </ul>
            </div>
          )}

          {/* FRONTEND TAB */}
          {activeTab === 'frontend' && (
            <div className="animate__animated animate__fadeIn">
              <h4 className="text-info border-bottom pb-2 mb-3">⚛️ Frontend Alkalmazás (React)</h4>
              <p>React 19 + Vite alapú webes alkalmazás React-Bootstrap UI elemekkel.</p>

              <h5 className="mt-4 text-secondary">🧩 Fő Komponensek</h5>
              
              <div className="card shadow-sm border-0 bg-light mb-3">
                <div className="card-body py-2">
                  <h6 className="card-title text-primary fw-bold mb-1">App.jsx (Főkomponens)</h6>
                  <p className="card-text small mb-0">Router logika, globális állapotok (<code>view</code>, <code>data</code>), és a fetch lekérések gyűjtőhelye.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 bg-light mb-3">
                <div className="card-body py-2">
                  <h6 className="card-title text-primary fw-bold mb-1">EpuletLista.jsx</h6>
                  <p className="card-text small mb-0">Épületek táblázatos nézete, inline szerkesztéssel és kép törlés lehetőséggel. Adatok API hívással frissülnek.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 bg-light mb-3">
                <div className="card-body py-2">
                  <h6 className="card-title text-primary fw-bold mb-1">EpiteszHozzaadasa.jsx</h6>
                  <p className="card-text small mb-0">Űrlap új építész (és első épülete) felvételére. Form validációt és <code>POST</code> kérést tartalmaz.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 bg-light mb-3">
                <div className="card-body py-2">
                  <h6 className="card-title text-primary fw-bold mb-1">KepHozzaadasa.jsx & KepFeltoltes.jsx</h6>
                  <p className="card-text small mb-0">Többlépcsős szűrés (Építész -&gt; Város -&gt; Épület) és kép előnézeti panellel ellátott fájl feltöltő modul.</p>
                </div>
              </div>

              <h5 className="mt-4 text-secondary">🔗 Fetch API Hívások</h5>
              <ul className="small text-muted">
                <li><strong>Lekérés (GET):</strong> <code>fetch(API_URL + '/epuletek')</code> json() parse-olással.</li>
                <li><strong>Küldés (POST):</strong> Adat küldése JSON <code>body</code> formátumban.</li>
                <li><strong>Képküldés:</strong> <code>FormData</code> objektum használata a <code>multipart/form-data</code> kezeléséhez.</li>
              </ul>

              <h5 className="mt-4 text-secondary">💡 Megoldások és Tippek</h5>
              <div className="alert alert-warning small py-2 mb-0">
                <strong>CORS hiba (Fetch failed):</strong> Győződj meg róla, hogy a backend szerver fut-e (alap: port 3333).<br/>
                <strong>Kép nem jelenik meg:</strong> Az <code>&lt;img src="..."&gt;</code> útvonalnak a backend publikus <code>/kepek/</code> mappájára kell mutatnia.
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default VizsgaFigyelmeztetes;