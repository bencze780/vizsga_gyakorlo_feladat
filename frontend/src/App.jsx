import React, { useState, useEffect } from 'react';
import { Container, Alert, Form, Row, Col } from 'react-bootstrap';
import './App.css';

// Komponensek importálása
import Navigacio from './komponens/Navigacio';
import EpiteszHozzaadasa from './komponens/EpiteszHozzaadasa';
import EpuletLista from './komponens/EpuletLista';
import KepHozzaadasa from './komponens/KepHozzaadasa';
import VizsgaFigyelmeztetes from './komponens/VizsgaFigyelmeztetes';
import TestRunner from './komponens/TestRunner';

const API_URL = 'http://localhost:3333/api';

/**
 * ═══════════════════════════════════════════════════════════════
 * 🏗️ ÉPÍTÉSZARCHÍVUM - FŐALKALMAZÁS
 * 
 * Fő komponens: router logika, adatok kezelése, nézetek
 * ═══════════════════════════════════════════════════════════════
 */
function App() {
  // ─────────────────────────────────────────────────────────────
  // STATE - Alkalmazás állapot
  // ─────────────────────────────────────────────────────────────
  
  const [view, setView] = useState('home');                    // Aktuális nézet
  const [data, setData] = useState({ epuletek: [], epiteszek: [] }); // Adatbázis adatok
  const [status, setStatus] = useState({ text: '', type: '', code: '' }); // Visszajelzés
  const [valasztottEpiteszId, setValasztottEpiteszId] = useState(null);  // Szűréshez

  // ─────────────────────────────────────────────────────────────
  // ADATOK LEKÉRÉSE
  // ─────────────────────────────────────────────────────────────

  const fetchData = async () => {
    try {
      // Párhuzamosan lekérjük az épületeket és építészeket
      const [resE, resA] = await Promise.all([
        fetch(`${API_URL}/epuletek`),
        fetch(`${API_URL}/epiteszek`)
      ]);
      
      const epuletek = await resE.json();
      const epiteszek = await resA.json();
      
      setData({ epuletek, epiteszek });
    } catch (err) {
      notify('Hiba az adatok lekérésekor!', 'error');
    }
  };

  // Adat frissítés oldal betöltéskor és nézet váltáskor
  useEffect(() => {
    fetchData();
  }, [view]);

  // Alapértelmezetten az első építész legyen kiválasztva
  useEffect(() => {
    if (data.epiteszek.length > 0 && !valasztottEpiteszId) {
      setValasztottEpiteszId(data.epiteszek[0].id);
    }
  }, [data.epiteszek]);

  // ─────────────────────────────────────────────────────────────
  // SEGÉD FÜGGVÉNYEK
  // ─────────────────────────────────────────────────────────────

  /**
   * Kép törlése az épületről
   */
  const handleTorles = async (id) => {
    if (!window.confirm('Biztosan törölni szeretné a képet ehhez az épülethez?')) return;
    try {
      const res = await fetch(`${API_URL}/epuletek/${id}/kep`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kep_url: null })
      });
      if (res.ok) {
        notify('Kép sikeresen eltávolítva!');
        fetchData();
      }
    } catch (err) {
      notify('Hiba a törlés során!', 'error');
    }
  };

  /**
   * Értesítés megjelenítése (automatikus eltűnés 5s után)
   */
  const notify = (msg, type = 'success') => {
    setStatus({ text: msg, type: type, code: '200' });
    setTimeout(() => setStatus({ text: '', type: '', code: '' }), 5000);
  };

  // ─────────────────────────────────────────────────────────────
  // RENDERELÉS
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="app-wrapper">
      {/* Navigáció */}
      <Navigacio aktualisNezet={view} setNezet={setView} />
      
      <main className="main-content">
        <Container fluid className="container">
          {/* Status üzenet */}
          {status.text && (
            <Alert variant={status.type === 'error' ? 'danger' : 'success'} className="mt-3 mb-4">
              {status.text}
            </Alert>
          )}

          {/* NÉZET 1: Kezdőlap - szűrés és épületek */}
          {view === 'home' && (
            <section className="animate__fadeIn">
              <div className="hero-section">
                <h1>🏗️ Épületek Nyilvántartása</h1> 
                <p>Válassz egy építészt, és fedezd fel az ő műveit!</p> 
              </div>

              {/* 📚 GYAKORLÓ FELADAT FIGYELMEZTETÉS ÉS DOKUMENTÁCIÓ */}
              <VizsgaFigyelmeztetes />

              {/* Funkció kártyák menü */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: '#212529', textAlign: 'center' }}>
                  ⚙️ Funkciók
                </h3>
                <div className="grid">
                  {/* Képek kezelése */}
                  <div 
                    className="card menu-card shadow-sm"
                    onClick={() => setView('add-image')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="card-body" style={{ textAlign: 'center', color: '#fff', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🖼️</div>
                      <h4 style={{ marginBottom: '8px' }}>Képek Kezelése</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Feltöltés és módosítás</p>
                    </div>
                  </div>

                  {/* Épületek listája */}
                  <div 
                    className="card menu-card shadow-sm"
                    onClick={() => setView('list')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="card-body" style={{ textAlign: 'center', color: '#fff', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
                      <h4 style={{ marginBottom: '8px' }}>Épületek Listája</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Összes épület megtekintése</p>
                    </div>
                  </div>

                  {/* Új építész */}
                  <div 
                    className="card menu-card shadow-sm"
                    onClick={() => setView('add-architect')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="card-body" style={{ textAlign: 'center', color: '#fff', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👷</div>
                      <h4 style={{ marginBottom: '8px' }}>Új Építész</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Hozzáadása az archívumhoz</p>
                    </div>
                  </div>

                  {/* Teszt futtató */}
                  <div 
                    className="card menu-card shadow-sm"
                    onClick={() => setView('test-runner')}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="card-body" style={{ textAlign: 'center', color: '#fff', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🧪</div>
                      <h4 style={{ marginBottom: '8px' }}>Tesztek Futtatása</h4>
                      <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>API és Unit tesztek</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Építész szelektor */}
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '8px',
                marginBottom: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <Form.Group>
                  <Form.Label style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>
                    👷 Válassz egy építészt:
                  </Form.Label>
                  <Form.Select
                    value={valasztottEpiteszId || ''}
                    onChange={(e) => setValasztottEpiteszId(Number(e.target.value))}
                    style={{ fontSize: '1rem' }}
                  >
                    <option value="">-- Válasszon --</option>
                    {data.epiteszek.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nev} ({a.stilus || '?'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              {/* Építész adatai */}
              {valasztottEpiteszId && data.epiteszek.find(e => e.id === valasztottEpiteszId) && (
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  padding: '25px',
                  borderRadius: '8px',
                  marginBottom: '30px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                }}>
                  {(() => {
                    const epitesz = data.epiteszek.find(e => e.id === valasztottEpiteszId);
                    const epiteszEpuletei = data.epuletek.filter(ep => ep.epitesz_neve === epitesz.nev).length;
                    return (
                      <>
                        <h2 style={{ marginBottom: '15px', fontSize: '2rem' }}>{epitesz.nev}</h2>
                        <Row className="g-3">
                          {epitesz.szulev && (
                            <Col md={4}>
                              <div>
                                <strong>📅 Születési év:</strong> {epitesz.szulev}
                              </div>
                            </Col>
                          )}
                          <Col md={4}>
                            <div>
                              <strong>🎨 Stílus:</strong> {epitesz.stilus || '—'}
                            </div>
                          </Col>
                          <Col md={4}>
                            <div>
                              <strong>🏢 Épületek:</strong> {epiteszEpuletei}
                            </div>
                          </Col>
                        </Row>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Épületek rács */}
              <div>
                <h3 style={{ marginBottom: '25px', color: '#212529', textAlign: 'center' }}>
                  🏛️ Műveik:
                </h3>
                {data.epiteszek.find(e => e.id === valasztottEpiteszId) && (
                  <div className="grid">
                    {data.epuletek
                      .filter(e => e.epitesz_neve === data.epiteszek.find(ep => ep.id === valasztottEpiteszId)?.nev)
                      .map(e => (
                        <div key={e.id} className="card epulet-card shadow-sm">
                          <div className="card-image-container">
                            {e.kep_url ? (
                              <img 
                                src={e.kep_url.startsWith('http') ? e.kep_url : `${API_URL.replace('/api', '')}/kepek/${e.kep_url}`} 
                                alt={e.nev} 
                                className="card-img-top"
                                onError={(el) => {
                                  el.target.style.display = 'none';
                                  el.target.parentNode.innerHTML = '<span class="no-image-placeholder">nincs kép</span>';
                                }}
                              />
                            ) : (
                              <span className="no-image-placeholder">Nincs kép</span> 
                            )}
                          </div>
                          <div className="card-body">
                            <span className="city-badge">{e.varos}</span>
                            <h3>{e.nev}</h3>
                            <p><strong>Épült:</strong> {e.epult || '—'}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Üres állapot */}
                {data.epiteszek.find(e => e.id === valasztottEpiteszId) && 
                 data.epuletek.filter(e => e.epitesz_neve === data.epiteszek.find(ep => ep.id === valasztottEpiteszId)?.nev).length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    color: '#999',
                    fontSize: '1.1rem'
                  }}>
                    <p>📭 Nincsenek rögzített épületek</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* NÉZET 2: Épületek listája */}
          {view === 'list' && (
            <EpuletLista 
              epuletek={data.epuletek} 
              onTorles={handleTorles} 
              apiUrl={API_URL}
            />
          )}

          {/* NÉZET 3: Új építész felvétele */}
          {view === 'add-architect' && (
            <EpiteszHozzaadasa 
              apiUrl={API_URL} 
              onSiker={(m) => notify(m)} 
              onHiba={(m) => notify(m, 'error')} 
              setNezet={setView} 
            />
          )}

          {/* NÉZET 4: Kép kezelése */}
          {view === 'add-image' && (
            <KepHozzaadasa 
              epuletek={data.epuletek}
              epiteszek={data.epiteszek}
              apiUrl={API_URL}
              onSiker={(m) => notify(m)}
              onHiba={(m) => notify(m, 'error')}
              frissites={fetchData}
            />
          )}

          {/* NÉZET 5: Teszt Futtató */}
          {view === 'test-runner' && (
            <TestRunner apiUrl={API_URL} />
          )}
        </Container>

        <footer className="app-footer">
          <p className="mb-0">&copy; 2026 Szoftverfejlesztő Vizsgaprojekt | ÉpítészArchívum</p>
        </footer>
      </main>
    </div>
  );
}

export default App;