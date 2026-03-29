import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ProgressBar } from 'react-bootstrap';

/**
 * ───────────────────────────────────────────────────────────────
 * KÉP HOZZÁADÁSA KOMPONENS
 * 
 * Funkciók:
 *   1. Új kép feltöltése és adatbázisba mentése adott épülethez
 *   2. Automatikus adatbázis frissítés
 * 
 * ───────────────────────────────────────────────────────────────
 */
const KepHozzaadasa = ({ epuletek, epiteszek, apiUrl, onSiker, onHiba, frissites }) => {
  // ─────────────────────────────────────────────────────────────
  // STATE - Komponens adatai
  // ─────────────────────────────────────────────────────────────

  // Szűréshez szükséges
  const [valasztottEpitesz, setValasztottEpitesz] = useState('');
  const [valasztottVaros, setValasztottVaros] = useState('');
  const [valasztottEpuletId, setValasztottEpuletId] = useState('');
  const [epultEv, setEpultEv] = useState('');

  // Feltöltéshez: új fájl
  const [valasztottKep, setValasztottKep] = useState(null);
  const [kepPreview, setKepPreview] = useState('');
  const [feltoltesMod, setFeltoltesMod] = useState('fajl'); // 'fajl' vagy 'url'
  const [kepUrl, setKepUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ─────────────────────────────────────────────────────────────
  // SZŰRÉSEK - VÁROS ÉS ÉPÜLET LEKÉRÉSE
  // ─────────────────────────────────────────────────────────────

  // Városok az adott építészhez
  const varosok = [...new Set(
    epuletek
      .filter(e => e.epitesz_neve === valasztottEpitesz)
      .map(e => e.varos)
  )];

  // Épületek az adott város és építészhez
  const szurtEpuletek = epuletek.filter(e => 
    e.epitesz_neve === valasztottEpitesz && e.varos === valasztottVaros
  );

  // ─────────────────────────────────────────────────────────────
  // FÁJLKEZELÉS
  // ─────────────────────────────────────────────────────────────

  /**
   * Fájl kiválasztásának kezelése
   * - Validáció: típus, méret
   * - Előnézet generálása
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setValasztottKep(null);
      setKepPreview('');
      return;
    }

    // Csak képfájlok
    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
      onHiba('Csak képfájlok: jpg, jpeg, png, gif, webp');
      setValasztottKep(null);
      setKepPreview('');
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      onHiba('Fájl túl nagy! Maximum 5MB.');
      setValasztottKep(null);
      setKepPreview('');
      return;
    }

    setValasztottKep(file);

    // Előnézet
    const reader = new FileReader();
    reader.onload = (event) => {
      setKepPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // ─────────────────────────────────────────────────────────────
  // FORM ELKÜLDÉSE
  // ─────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Épület kötelezően
    if (!valasztottEpuletId) {
      onHiba('Válassz egy épületet!');
      return;
    }

    if (feltoltesMod === 'fajl' && !valasztottKep) {
      onHiba('Válassz egy képet!');
      return;
    }

    if (feltoltesMod === 'url' && !kepUrl.trim()) {
      onHiba('Add meg a kép URL-jét!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let finalKepUrl = '';

      if (feltoltesMod === 'fajl') {
        const formData = new FormData();
        formData.append('kep', valasztottKep);
        
        const uploadRes = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadRes.json();

        if (uploadRes.ok && uploadData.fileName) {
          finalKepUrl = uploadData.fileName;
        } else {
          onHiba(`Feltöltési hiba: ${uploadData.message || 'Ismeretlen hiba'}`);
          setUploading(false);
          return;
        }
      } else {
        finalKepUrl = kepUrl.trim();
      }

      // Adatbázisba mentés
      const dbRes = await fetch(`${apiUrl}/epuletek/${valasztottEpuletId}/kep`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          kep_url: finalKepUrl,
          epult: epultEv ? parseInt(epultEv, 10) : null 
        })
      });

      if (dbRes.ok) {
        onSiker('Kép sikeresen feltöltve és mentve!');
        // Form törlése
        setValasztottKep(null);
        setKepPreview('');
        setKepUrl('');
        setEpultEv('');
        const input = document.getElementById('kepFajlInput');
        if (input) input.value = '';
        
        // Frissítjük az épületek adatait az App-ban
        if (frissites) frissites();
      } else {
        onHiba('Hiba az adatbázisba mentéskor');
      }
      setUploading(false);
    } catch (error) {
      console.error('Feltöltési hiba:', error);
      onHiba('Feltöltési hiba - szerver nem elérhető');
      setUploading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // RENDERELÉS
  // ─────────────────────────────────────────────────────────────

  return (
    <Container className="form-card animate__fadeIn">
      <h3 className="text-center mb-4">🖼️ Kép hozzárendelése épülethez</h3> 
      
      <Form onSubmit={handleSubmit}>
        
        {/* 1. ÉPÍTÉSZ KIVÁLASZTÁSA */}
        <Form.Group className="mb-3">
          <Form.Label><strong>1. Építész</strong></Form.Label> 
          <Form.Select
            value={valasztottEpitesz} 
            onChange={(e) => { 
              setValasztottEpitesz(e.target.value); 
              setValasztottVaros('');
              setValasztottEpuletId('');
              setEpultEv('');
            }}
            required
          >
            <option value="">-- Válasszon --</option> 
            {epiteszek.map(a => (
              <option key={a.id} value={a.nev}>
                {a.nev}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* 2. VÁROS KIVÁLASZTÁSA */}
        <Form.Group className="mb-3">
          <Form.Label><strong>2. Város</strong></Form.Label> 
          <Form.Select
            value={valasztottVaros} 
          onChange={(e) => {
            setValasztottVaros(e.target.value);
            setValasztottEpuletId('');
            setEpultEv('');
          }}
            disabled={!valasztottEpitesz}
            required
          >
            <option value="">-- Válasszon --</option> 
            {varosok.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* 3. ÉPÜLET KIVÁLASZTÁSA */}
        <Form.Group className="mb-3">
          <Form.Label><strong>3. Épület</strong></Form.Label> 
          <Form.Select
            value={valasztottEpuletId} 
          onChange={(e) => {
            setValasztottEpuletId(e.target.value);
            const ep = szurtEpuletek.find(x => x.id.toString() === e.target.value);
            if (ep && ep.epult) {
              setEpultEv(ep.epult);
            } else {
              setEpultEv('');
            }
          }}
            disabled={!valasztottVaros}
            required
          >
            <option value="">-- Válasszon --</option> 
            {szurtEpuletek.map(ep => (
              <option key={ep.id} value={ep.id}>
                {ep.nev} {ep.kep_url ? '✓' : '✗'}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

      {/* ÉPÍTÉS ÉVE */}
      <Form.Group className="mb-3">
        <Form.Label><strong>Építés éve (opcionális)</strong></Form.Label> 
        <Form.Control
          type="number"
          placeholder="Pl.: 1896"
          value={epultEv}
          onChange={(e) => setEpultEv(e.target.value)}
          disabled={!valasztottEpuletId || uploading}
        />
      </Form.Group>

        {/* 4. KÉP FORRÁSA */}
        <Form.Group className="mb-3">
          <Form.Label><strong>4. Kép forrása</strong></Form.Label>
          
          <div className="mb-3">
            <Form.Check 
              inline
              type="radio" 
              label="Fájl feltöltése" 
              name="kepForrasRadio" 
              checked={feltoltesMod === 'fajl'}
              onChange={() => { setFeltoltesMod('fajl'); setKepPreview(''); }}
            />
            <Form.Check 
              inline
              type="radio" 
              label="Kép URL megadása" 
              name="kepForrasRadio" 
              checked={feltoltesMod === 'url'}
              onChange={() => { setFeltoltesMod('url'); setKepPreview(kepUrl); }}
            />
          </div>

          {feltoltesMod === 'fajl' ? (
            <>
              <Form.Control
                id="kepFajlInput"
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Form.Text className="d-block mt-2" style={{ fontSize: '0.85rem' }}>
                Max 5MB, támogatott: JPG, PNG, GIF, WebP
              </Form.Text>
            </>
          ) : (
            <Form.Control
              type="url"
              placeholder="https://pelda.hu/kep.jpg"
              value={kepUrl}
              onChange={(e) => {
                setKepUrl(e.target.value);
                setKepPreview(e.target.value);
              }}
              disabled={uploading}
            />
          )}

        </Form.Group>

        {/* KÉP ELŐNÉZET */}
        {kepPreview && (
          <div className="text-center mb-4">
            <p style={{ fontSize: '0.9rem', color: '#666' }}>📸 Előnézet:</p>
            <img 
              src={kepPreview} 
              alt="Előnézet" 
              style={{ 
                maxHeight: '200px', 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* FELTÖLTÉS PROGRESS */}
        {uploading && uploadProgress > 0 && (
          <div className="mb-4">
            <ProgressBar 
              now={uploadProgress} 
              label={`${Math.round(uploadProgress)}%`} 
            />
          </div>
        )}

        {/* GOMBÓK */}
        <div className="d-grid gap-2">
          <Button 
            type="submit" 
            className="btn-main"
            size="lg"
            disabled={uploading || (feltoltesMod === 'fajl' ? !valasztottKep : !kepUrl.trim())}
          >
            {uploading ? `⏳ ${Math.round(uploadProgress)}%` : '✓ Mentés'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default KepHozzaadasa;
