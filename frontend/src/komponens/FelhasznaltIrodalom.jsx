import React from 'react';
import { Container, Card, ListGroup, Badge } from 'react-bootstrap';

const FelhasznaltIrodalom = () => {
    return (
        <Container className="animate__fadeIn mt-4">
            <Card className="p-4 shadow-sm border-0" style={{ borderRadius: '10px' }}>
                <h2 className="mb-4">📚 Felhasznált Irodalom és Források</h2>

                <h4 className="mb-3 text-secondary" style={{ fontSize: '1.2rem' }}>Építészettörténeti Források</h4>
                <ListGroup className="mb-4">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Sisa József - Dora Wiebenson:</strong> Magyarország építészetének története</div>
                        <Badge bg="light" text="dark" className="border">Könyv</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Rados Jenő:</strong> Magyar építészettörténet</div>
                        <Badge bg="light" text="dark" className="border">Könyv</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Lechner Tudásközpont</strong> - Online építészeti archívum</div>
                        <a href="https://lechnerkozpont.hu/" target="_blank" rel="noreferrer" className="text-decoration-none">Megtekintés ↗</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Wikipédia:</strong> Magyar építészek listája</div>
                        <a href="https://hu.wikipedia.org/wiki/Kateg%C3%B3ria:Magyar_%C3%A9p%C3%ADt%C3%A9szek" target="_blank" rel="noreferrer" className="text-decoration-none">Megtekintés ↗</a>
                    </ListGroup.Item>
                </ListGroup>

                <h4 className="mb-3 text-secondary" style={{ fontSize: '1.2rem' }}>Szoftverfejlesztési Dokumentációk</h4>
                <ListGroup>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>React JS</strong> hivatalos dokumentáció (v19)</div>
                        <a href="https://react.dev" target="_blank" rel="noreferrer" className="text-decoration-none">react.dev ↗</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Express.js</strong> API referencia</div>
                        <a href="https://expressjs.com" target="_blank" rel="noreferrer" className="text-decoration-none">expressjs.com ↗</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>React-Bootstrap</strong> UI komponens könyvtár</div>
                        <a href="https://react-bootstrap.github.io" target="_blank" rel="noreferrer" className="text-decoration-none">react-bootstrap.io ↗</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>MySQL2</strong> adatbázis kliens Node.js-hez</div>
                        <a href="https://sidorares.github.io/node-mysql2/" target="_blank" rel="noreferrer" className="text-decoration-none">Dokumentáció ↗</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Multer</strong> (Fájlfeltöltés kezelése Expressben)</div>
                        <a href="https://github.com/expressjs/multer" target="_blank" rel="noreferrer" className="text-decoration-none">Dokumentáció ↗</a>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div><strong>Jest & Supertest</strong> (API és Unit tesztelés)</div>
                        <a href="https://jestjs.io" target="_blank" rel="noreferrer" className="text-decoration-none">jestjs.io ↗</a>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Container>
    );
};

export default FelhasznaltIrodalom;