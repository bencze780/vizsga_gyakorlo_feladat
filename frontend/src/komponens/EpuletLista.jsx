import React, { useState } from 'react';
import { Table, Container, Button, Form, Alert } from 'react-bootstrap';

/**
 * ───────────────────────────────────────────────────────────────
 * ÉPÜLETEK LISTÁJA KOMPONENS
 * 
 * Összes épület megjelenítése táblázat formátumban
 * Képek megtekintése, törlés funkció
 * ───────────────────────────────────────────────────────────────
 */
const EpuletLista = ({ epuletek, apiUrl }) => {
  // Állapotok a módosításhoz
  const [szerkesztesId, setSzerkesztesId] = useState(null);
  const [szerkesztesAdatok, setSzerkesztesAdatok] = useState({ nev: '', varos: '', epult: '' });
  const [visszajelzes, setVisszajelzes] = useState({ lathato: false, tipus: '', uzenet: '', statusz: null });

  // Adatok mentése a backend felé
  const handleAdatMentes = async (epuletId) => {
    try {
      const res = await fetch(`${apiUrl}/epuletek/${epuletId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(szerkesztesAdatok)
      });
      
      if (res.ok) {
        setVisszajelzes({ lathato: true, tipus: 'success', uzenet: 'Adatok sikeresen módosítva!', statusz: res.status });
        setSzerkesztesId(null);
        setTimeout(() => window.location.reload(), 1500); // Késleltetett frissítés
      } else {
        const errData = await res.json();
        setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: `Hiba az adatok módosításakor: ${errData.message || 'Ismeretlen hiba történt'}`, statusz: res.status });
      }
    } catch (error) {
      console.error('Hiba:', error);
      setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: 'Váratlan hiba történt a mentés során.', statusz: 500 });
    }
  };

  // Kép módosítása (feltöltés és hozzárendelés)
  const handleKepModositas = async (epuletId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('kep', file);

    try {
      // 1. Új kép feltöltése
      const uploadRes = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!uploadRes.ok) {
        setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: 'Hiba a kép feltöltésekor!', statusz: uploadRes.status });
        return;
      }
      
      const uploadData = await uploadRes.json();
      
      // 2. Kép hozzárendelése az épülethez
      const updateRes = await fetch(`${apiUrl}/epuletek/${epuletId}/kep`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kep_url: uploadData.fileName })
      });

      if (updateRes.ok) {
        setVisszajelzes({ lathato: true, tipus: 'success', uzenet: 'Kép sikeresen módosítva!', statusz: updateRes.status });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: 'Hiba a kép hozzárendelésekor!', statusz: updateRes.status });
      }
    } catch (error) {
      console.error('Hiba:', error);
      setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: 'Váratlan hiba történt a kép módosításakor.', statusz: 500 });
    }
  };

  // Kép törlése (leválasztás az épületről)
  const handleKepTorles = async (epuletId) => {
    if (!window.confirm('Biztosan törölni szeretnéd a képet erről az épületről?')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/epuletek/${epuletId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setVisszajelzes({ lathato: true, tipus: 'success', uzenet: 'Kép sikeresen törölve!', statusz: res.status });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errData = await res.json();
        setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: `Hiba a kép törlésekor: ${errData.message || 'Ismeretlen hiba'}`, statusz: res.status });
      }
    } catch (error) {
      setVisszajelzes({ lathato: true, tipus: 'danger', uzenet: 'Váratlan hiba történt a kép törlése során.', statusz: 500 });
    }
  };

  return (
    <Container fluid className="animate__fadeIn">
      <div className="mb-4">
        <h2 className="text-center mb-4" style={{ color: '#212529' }}>
          📋 Nyilvántartott Épületek ({epuletek.length} db)
        </h2>

        {/* Visszajelző üzenet (Alert) */}
        {visszajelzes.lathato && (
          <Alert 
            variant={visszajelzes.tipus} 
            onClose={() => setVisszajelzes({ ...visszajelzes, lathato: false })} 
            dismissible
            className="shadow-sm animate__animated animate__fadeInDown"
          >
            <strong>{visszajelzes.statusz ? `[${visszajelzes.statusz}] ` : ''}</strong>
            {visszajelzes.uzenet}
          </Alert>
        )}

        {epuletek.length > 0 ? (
          <div className="table-responsive">
            <Table striped hover responsive className="sculpture-table">
              {/* Táblázat fejléc */}
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Épület neve</th>
                  <th>Város</th>
                  <th>Épült</th>
                  <th>Építész</th>
                  <th>Kép</th>
                  <th>Művelet</th>
                </tr>
              </thead>

              {/* Táblázat törzse - adatok */}
              <tbody>
                {epuletek.map((e) => (
                  <tr key={e.id}>
                    {szerkesztesId === e.id ? (
                      <>
                        {/* ──────────── SZERKESZTŐ MÓD ──────────── */}
                        <td>
                          <span style={{ background: '#e7f3ff', padding: '4px 8px', borderRadius: '4px', fontWeight: '600', color: '#0066cc' }}>
                            #{e.id}
                          </span>
                        </td>
                        <td>
                          <Form.Control size="sm" value={szerkesztesAdatok.nev} onChange={(ev) => setSzerkesztesAdatok({...szerkesztesAdatok, nev: ev.target.value})} />
                        </td>
                        <td>
                          <Form.Control size="sm" value={szerkesztesAdatok.varos} onChange={(ev) => setSzerkesztesAdatok({...szerkesztesAdatok, varos: ev.target.value})} />
                        </td>
                        <td>
                          <Form.Control size="sm" type="number" value={szerkesztesAdatok.epult} onChange={(ev) => setSzerkesztesAdatok({...szerkesztesAdatok, epult: ev.target.value})} />
                        </td>
                        <td style={{ color: '#666' }}>{e.epitesz_neve || '—'}</td>
                        <td>
                          {e.kep_url ? (
                            <img 
                              src={e.kep_url.startsWith('http') ? e.kep_url : `${apiUrl.replace('/api', '')}/kepek/${e.kep_url}`} 
                              alt={e.nev} 
                              className="table-img"
                              onError={(el) => {
                                el.target.style.display = 'none';
                                el.target.parentNode.innerHTML = '<span style="color: #999; font-size: 0.9rem;">✗</span>';
                              }}
                            />
                          ) : (
                            <span style={{ color: '#999', fontSize: '0.9rem' }}>✗</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-2">
                            <Button variant="success" size="sm" onClick={() => handleAdatMentes(e.id)}>
                              💾 Mentés
                            </Button>
                            <label className="btn btn-outline-primary btn-sm mb-0" style={{ cursor: 'pointer' }}>
                              🔄 Kép cseréje
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(event) => handleKepModositas(e.id, event)} />
                            </label>
                            <Button variant="secondary" size="sm" onClick={() => setSzerkesztesId(null)}>
                              ❌ Mégse
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* ──────────── MEGJELENÍTŐ MÓD ──────────── */}
                        {/* ID */}
                        <td>
                          <span style={{ 
                            background: '#e7f3ff', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            fontWeight: '600',
                            color: '#0066cc'
                          }}>
                            #{e.id}
                          </span>
                        </td>

                        {/* Épület neve */}
                        <td style={{ fontWeight: '600', color: '#212529' }}>
                          {e.nev}
                        </td>

                        {/* Város */}
                        <td>
                          <span style={{ 
                            background: '#ecf0f1', 
                            padding: '4px 8px', 
                            borderRadius: '4px'
                          }}>
                            {e.varos}
                          </span>
                        </td>

                        {/* Épült év */}
                        <td>{e.epult || '—'}</td>

                        {/* Építész neve */}
                        <td style={{ color: '#666' }}>
                          {e.epitesz_neve || '—'}
                        </td>

                        {/* Kép előnézet */}
                        <td>
                          {e.kep_url ? (
                            <img 
                              src={e.kep_url.startsWith('http') ? e.kep_url : `${apiUrl.replace('/api', '')}/kepek/${e.kep_url}`} 
                              alt={e.nev} 
                              className="table-img"
                              onError={(el) => {
                                el.target.style.display = 'none';
                                el.target.parentNode.innerHTML = '<span style="color: #999; font-size: 0.9rem;">✗</span>';
                              }}
                            />
                          ) : (
                            <span style={{ color: '#999', fontSize: '0.9rem' }}>✗</span>
                          )}
                        </td>

                        {/* Művelet gombok */}
                        <td>
                          <div className="d-flex flex-column gap-2">
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => {
                                setSzerkesztesId(e.id);
                                setSzerkesztesAdatok({ nev: e.nev, varos: e.varos, epult: e.epult || '' });
                              }}
                            >
                              ✏️ Módosítás
                            </Button>

                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => handleKepTorles(e.id)}
                              disabled={!e.kep_url}
                            >
                              🖼️ Kép törlése
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          // Üres lista üzenet
          <div style={{ 
            textAlign: 'center', 
            padding: '50px 20px',
            color: '#999',
            fontSize: '1.1rem'
          }}>
            <p>📭 Nincsenek rögzített épületek az adatbázisban.</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default EpuletLista;