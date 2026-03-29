import React, { useState } from 'react';
import { Form, Button, Container, ProgressBar } from 'react-bootstrap';

const KepFeltoltes = ({ apiUrl, onSiker, onHiba }) => {
  const [valasztottKep, setValasztottKep] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setValasztottKep(null);
      setPreview('');
      return;
    }

    // Ellenőrzés: csak képfájlok
    if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
      onHiba('Csak képfájlok engedélyezve: jpg, jpeg, png, gif, webp');
      setValasztottKep(null);
      setPreview('');
      return;
    }

    // Ellenőrzés: maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      onHiba('A fájl túl nagy! Maximum 5MB engedélyezett.');
      setValasztottKep(null);
      setPreview('');
      return;
    }

    setValasztottKep(file);

    // Előnézet generálása
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valasztottKep) {
      onHiba('Válassz egy képet a feltöltéshez!');
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('kep', valasztottKep);

    try {
      // Modern AJAX (fetch API) használata az XHR helyett
      // Mivel a fetch natívan nem támogatja az upload progress-t, szimuláljuk
      setProgress(50);

      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData
      });

      if (res.status === 201) {
        const response = await res.json();
        setProgress(100);
        onSiker(`✓ Kép sikeresen feltöltve: ${response.fileName}`);
        setValasztottKep(null);
        setPreview('');
        setTimeout(() => setProgress(0), 1000); // Progress reset egy kis késleltetéssel
        // Input field törlése
        document.getElementById('kepInput').value = '';
      } else {
        onHiba(`Hiba a feltöltéskor (${res.status})`);
      }
      setLoading(false);
    } catch (err) {
      console.error('Upload hiba:', err);
      onHiba('Hiba a feltöltéskor - szerver nem elérhető');
      setLoading(false);
    }
  };

  return (
    <Container className="form-card animate__fadeIn">
      <h3 className="text-center mb-4">📤 Kép Feltöltése</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4">
          <Form.Label><strong>Válassz egy képet</strong></Form.Label>
          <Form.Control
            id="kepInput"
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            disabled={loading}
          />
          <Form.Text className="d-block mt-2">
            ℹ️ Támogatott formátumok: JPG, JPEG, PNG, GIF, WebP (Max: 5MB)
          </Form.Text>
        </Form.Group>

        {/* Előnézet */}
        {preview && (
          <div className="text-center mb-4">
            <p className="small text-muted">📸 Előnézet:</p>
            <img
              src={preview}
              alt="Előnézet"
              style={{
                maxHeight: '250px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
              {valasztottKep?.name}
            </p>
          </div>
        )}

        {/* Progress bar */}
        {loading && progress > 0 && (
          <div className="mb-4">
            <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
          </div>
        )}

        <div className="d-grid gap-2">
          <Button
            type="submit"
            className="btn-main"
            size="lg"
            disabled={!valasztottKep || loading}
          >
            {loading ? `⏳ Feltöltés ${Math.round(progress)}%...` : '✓ Kép Feltöltése'}
          </Button>
        </div>
      </Form>

      {/* Információ */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#ecf0f1',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#555'
      }}>
        <strong>💡 Útmutató:</strong>
        <ul style={{ margin: '10px 0 0 20px' }}>
          <li>Feltöltsd a képeket ide</li>
          <li>A képek a <code>public/kepek</code> mappában lesznek tárolva</li>
          <li>Ezt követően a "Kép módosítása" fülön kiválaszthatod őket</li>
        </ul>
      </div>
    </Container>
  );
};

export default KepFeltoltes;
