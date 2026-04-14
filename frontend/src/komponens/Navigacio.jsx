import React from 'react';
import { Nav } from 'react-bootstrap';

/**
 * ───────────────────────────────────────────────────────────────
 * NAVIGÁCIÓ KOMPONENS
 * 
 * Oldalsó navigációs sáv a nézetek közötti navigáláshoz
 * Aktív nézet kiemeléséhez
 * ───────────────────────────────────────────────────────────────
 */
const Navigacio = ({ aktualisNezet, setNezet }) => {
  return (
    <nav className="sidebar bg-dark text-white p-3">
      {/* Logo - kattintás a kezdőlapra */}
      <div
        className="brand p-3"
        onClick={() => setNezet('home')}
        style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: 'bold' }}
      >
        🏗️ ÉpítészArchívum
      </div>

      <hr />

      <Nav variant="pills" activeKey={aktualisNezet} onSelect={(key) => setNezet(key)} className="flex-column">
        {/* Kezdőlap */}
        <Nav.Item>
          <Nav.Link eventKey="home">Kezdőlap</Nav.Link>
        </Nav.Item>

        {/* Épületek lista */}
        <Nav.Item>
          <Nav.Link eventKey="list">Épületek</Nav.Link>
        </Nav.Item>

        {/* Új építész */}
        <Nav.Item>
          <Nav.Link eventKey="add-architect">Új Építész</Nav.Link>
        </Nav.Item>

        {/* Kép kezelése */}
        <Nav.Item>
          <Nav.Link eventKey="add-image">Kép Kezelése</Nav.Link>
        </Nav.Item>

        {/* Tesztek futtatása */}
        <Nav.Item>
          <Nav.Link eventKey="test-runner">Tesztek</Nav.Link>
        </Nav.Item>
      </Nav>
    </nav>
  );
};

export default Navigacio;