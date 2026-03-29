import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

/**
 * ───────────────────────────────────────────────────────────────
 * ÉPÍTÉSZ HOZZÁADÁSA KOMPONENS
 * 
 * Form új építész adatainak rögzítéséhez
 * POST /api/epiteszek - backend API hívás
 * ───────────────────────────────────────────────────────────────
 */
const EpiteszHozzaadasa = ({ apiUrl, onSiker, onHiba, setNezet, frissites }) => {
  /**
   * Form elküldésének kezelése
   * - Adatok gyűjtése a form-ból
   * - API hívás
   * - Sikeres/sikertelen visszajelzés
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form adatai JSON-ba
    const ujEpitesz = {
      nev: e.target.nev.value,
      szulev: e.target.szulev.value,
      stilus: e.target.stilus.value,
      varos: e.target.varos.value,
      epulet_nev: e.target.epulet_nev.value
    };

    try {
      // POST kérés az adatbázisba
      const res = await fetch(`${apiUrl}/epiteszek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ujEpitesz)
      });

      const data = await res.json();

      if (res.ok) {
        // Siker
        onSiker(`Építész sikeresen hozzáadva!`);
        if (frissites) frissites(); // Adatok újratöltése a backendről
        setNezet('home'); // Visszatérés kezdőlapra
      } else {
        // Hiba az API-tól
        onHiba(`Hiba: ${data.message || 'Szerver hiba'}`);
      }
    } catch (error) {
      // Hálózati hiba
      onHiba('A szerver nem elérhető.');
    }
  };

  return (
    <Container className="form-card animate__fadeIn">
      <h3 className="text-center mb-4">👷 Új építész rögzítése</h3>
      
      <Form onSubmit={handleSubmit}>
        {/* Építész neve - kötelező */}
        <Form.Group className="mb-3">
          <Form.Label><strong>Építész neve</strong></Form.Label>
          <Form.Control 
            name="nev" 
            type="text" 
            placeholder="pl. Makovecz Imre" 
            required 
          />
        </Form.Group>

        {/* Születési év - opcionális */}
        <Form.Group className="mb-3">
          <Form.Label><strong>Születési év</strong></Form.Label>
          <Form.Control 
            name="szulev" 
            type="number" 
            placeholder="pl. 1935" 
          />
        </Form.Group>

        {/* Stílus - kötelező */}
        <Form.Group className="mb-4">
          <Form.Label><strong>Épitészeti stílus</strong></Form.Label>
          <Form.Control 
            name="stilus" 
            type="text" 
            placeholder="pl. Szecesszió, Modernizmus" 
            required 
          />
        </Form.Group>
        
        {/* Város - kötelező, hogy megjelenjen a listákban */}
        <Form.Group className="mb-3">
          <Form.Label><strong>Város (ahol a mű található)</strong></Form.Label>
          <Form.Control 
            name="varos" 
            type="text" 
            placeholder="pl. Budapest" 
            required 
          />
        </Form.Group>

        {/* Épület / Szobor neve - kötelező */}
        <Form.Group className="mb-4">
          <Form.Label><strong>Szobor / Épület neve</strong></Form.Label>
          <Form.Control 
            name="epulet_nev" 
            type="text" 
            placeholder="pl. Iparművészeti Múzeum" 
            required 
          />
        </Form.Group>

        {/* Gombók */}
        <div className="d-grid gap-2">
          {/* Mentés gomb */}
          <Button 
            variant="primary" 
            size="lg"
            type="submit" 
            className="btn-main"
          >
            ✓ Építész mentése
          </Button>

          {/* Mégse gomb - vissza az előző oldalra */}
          <Button 
            variant="outline-secondary" 
            onClick={() => setNezet('home')}
          >
            ← Mégse
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EpiteszHozzaadasa;