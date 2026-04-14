import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

/**
 * ───────────────────────────────────────────────────────────────
 * NAVIGÁCIÓ KOMPONENS
 * 
 * Felső navigációs sáv (navbar) a nézetek közötti navigáláshoz
 * Aktív nézet kiemeléséhez
 * ───────────────────────────────────────────────────────────────
 */
const Navigacio = ({ aktualisNezet, setNezet }) => {
  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar">
      <Container fluid>
        {/* Logo - kattintás a kezdőlapra */}
        <Navbar.Brand 
          className="brand"
          onClick={() => setNezet('home')} 
          style={{ cursor: 'pointer' }}
        >
          🏗️ ÉpítészArchívum
        </Navbar.Brand>

        {/* Toggle gomb mobil nézeténél */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Kezdőlap */}
            <Nav.Link 
              className={aktualisNezet === 'home' ? 'active' : ''} 
              onClick={() => setNezet('home')}
            >
              Kezdőlap
            </Nav.Link>

            {/* Épületek lista */}
            <Nav.Link 
              className={aktualisNezet === 'list' ? 'active' : ''} 
              onClick={() => setNezet('list')}
            >
              Épületek
            </Nav.Link>

            {/* Új építész */}
            <Nav.Link 
              className={aktualisNezet === 'add-architect' ? 'active' : ''} 
              onClick={() => setNezet('add-architect')}
            >
              Új Építész
            </Nav.Link>

            {/* Kép kezelése */}
            <Nav.Link 
              className={aktualisNezet === 'add-image' ? 'active' : ''} 
              onClick={() => setNezet('add-image')}
            >
              Kép Kezelése
            </Nav.Link>

            {/* Tesztek futtatása */}
            <Nav.Link 
              className={aktualisNezet === 'test-runner' ? 'active' : ''} 
              onClick={() => setNezet('test-runner')}
            >
              🧪 Tesztek
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigacio;