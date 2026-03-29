// ═════════════════════════════════════════════════════════════════
// 🏗️ ÉPÍTÉSZARCHÍVUM - BACKEND API
// Express szerver MySQL adatbázissal és képfeltöltéssel
// ═════════════════════════════════════════════════════════════════

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

// ═════════════════════════════════════════════════════════════════
// MIDDLEWARE - Alapvető beállítások
// ═════════════════════════════════════════════════════════════════

app.use(cors());                                  // Böngészőről jövő kéréseket engedélyez
app.use(express.json());                          // JSON kérések feldolgozása
app.use('/kepek', express.static(path.join(__dirname, 'public/kepek'))); // Feltöltött képek kiszolgálása

// ═════════════════════════════════════════════════════════════════
// KÉPFELTÖLTÉS BEÁLLÍTÁSA (multer)
// ═════════════════════════════════════════════════════════════════

const imagesPath = path.join(__dirname, 'public/kepek');
if (!fs.existsSync(imagesPath)) {
    fs.mkdirSync(imagesPath, { recursive: true }); // Ha nem létezik, létrehozzuk
}

// Multer tárhely konfiguráció
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesPath); // Fájlok ide kerülnek
    },
    filename: (req, file, cb) => {
        // Egyedi nevet adunk a fájlnak (timestamp + random)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, name + '-' + uniqueSuffix + ext);
    }
});

// Fájl szűrés - csak képfájlokat fogad el
const fileFilter = (req, file, cb) => {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Csak képfájlok engedélyezve!'), false);
    }
};

// Multer middleware - max 5MB
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ═════════════════════════════════════════════════════════════════
// ADATBÁZIS KAPCSOLAT
// ═════════════════════════════════════════════════════════════════

const db = mysql.createPool({
    host: 'localhost',
    port: 3307,           // Ellenőrizd az saját MySQL portod (XAMPP-ban 3306, MAMP-ban 3307)
    user: 'root',
    password: 'root',     // Szintén ellenőrizd
    database: 'epiteszet'
}).promise();  // Promise-alapú API használatához

// ═════════════════════════════════════════════════════════════════
// API VÉGPONTOK
// ═════════════════════════════════════════════════════════════════

/**
 * GET /api/epuletek
 * Összes épület lekérése az építész nevével
 */
app.get('/api/epuletek', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT epulet.*, epitesz.nev AS epitesz_neve, epitesz.id AS epitesz_id
            FROM epulet 
            LEFT JOIN kapcsolat ON epulet.id = kapcsolat.epulet_id 
            LEFT JOIN epitesz ON kapcsolat.epitesz_id = epitesz.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Hiba az épületek lekérésekor', error: err.message });
    }
});

/**
 * GET /api/epiteszek
 * Összes építész lekérése
 */
app.get('/api/epiteszek', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM epitesz');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Hiba az építészek lekérésekor', error: err.message });
    }
});

/**
 * GET /api/images-list
 * Feltöltött képek listája a public/kepek mappából
 */
app.get('/api/images-list', (req, res) => {
    try {
        const files = fs.readdirSync(imagesPath);
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)  // Csak képfájlok
        );
        res.json(imageFiles);
    } catch (err) {
        res.status(500).json({ message: 'Hiba a képek listázásakor' });
    }
});

/**
 * POST /api/epiteszek
 * Új építész hozzáadása az adatbázishoz
 * Body: { nev: string, szulev?: number, stilus: string }
 */
app.post('/api/epiteszek', async (req, res) => {
    const { nev, szulev, stilus, varos, epulet_nev } = req.body;
    
    // Validáció - kötelező mezők
    if (!nev || !stilus || !varos || !epulet_nev) {
        return res.status(400).json({ message: 'A név, stílus, város és épületnév megadása kötelező!' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO epitesz (nev, szulev, stilus) VALUES (?, ?, ?)',
            [nev, szulev || null, stilus]
        );
        const epiteszId = result.insertId;

        // Ha várost és épület/szobor nevet is megadtak, mentsük el azt is
        if (varos && epulet_nev) {
            const [epuletResult] = await db.query(
                'INSERT INTO epulet (nev, varos) VALUES (?, ?)',
                [epulet_nev, varos]
            );
            const epuletId = epuletResult.insertId;

            // Kapcsolat létrehozása
            await db.query(
                'INSERT INTO kapcsolat (epitesz_id, epulet_id) VALUES (?, ?)',
                [epiteszId, epuletId]
            );
        }

        res.status(201).json({ message: 'Építész (és első épülete) sikeresen hozzáadva!', id: epiteszId });
    } catch (err) {
        res.status(500).json({ message: 'Hiba az adatbázis mentés során' });
    }
});

/**
 * POST /api/upload
 * Kép feltöltése az szerverre (multer middleware)
 * FormData: { kep: File }
 */
app.post('/api/upload', (req, res, next) => {
    upload.single('kep')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ message: 'Fájl túl nagy! Max 5MB.' });
            }
            return res.status(400).json({ message: 'Feltöltési hiba: ' + err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Kép feltöltése szükséges!' });
        }

        const fileName = req.file.filename;
        res.status(201).json({ 
            message: 'Kép sikeresen feltöltve!',
            fileName: fileName,
            fileUrl: `/kepek/${fileName}`
        });
    } catch (err) {
        res.status(500).json({ message: 'Hiba a képfeltöltéskor' });
    }
});

/**
 * PUT /api/epuletek/:id/kep
 * Kép URL és építési év hozzárendelése egy épülethez
 * Body: { kep_url: string, epult?: number }
 */
app.put('/api/epuletek/:id/kep', async (req, res) => {
    try {
        const { kep_url, epult } = req.body;
        let query = 'UPDATE epulet SET kep_url = ?';
        let params = [kep_url];

        if (epult !== undefined) {
            query += ', epult = ?';
            params.push(epult);
        }

        query += ' WHERE id = ?';
        params.push(req.params.id);

        await db.query(query, params);
        res.json({ message: 'Adatok sikeresen frissítve!' });
    } catch (err) {
        res.status(500).json({ message: 'Hiba a frissítéskor' });
    }
});

/**
 * PUT /api/epuletek/:id
 * Épület adatainak módosítása (név, város, év)
 * Body: { nev: string, varos: string, epult: number }
 */
app.put('/api/epuletek/:id', async (req, res) => {
    try {
        const { nev, varos, epult } = req.body;
        
        // Építés évének biztonságos formázása, hogy ne okozzon adatbázis hibát
        let epultValue = null;
        if (epult !== undefined && epult !== '' && epult !== null) {
            epultValue = parseInt(epult, 10);
        }

        await db.query(
            'UPDATE epulet SET nev = ?, varos = ?, epult = ? WHERE id = ?',
            [nev, varos, epultValue, req.params.id]
        );
        res.json({ message: 'Épület adatai sikeresen frissítve!' });
    } catch (err) {
        console.error('Hiba a módosításkor:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * DELETE /api/epuletek/:id
 * Kép törlése az épületről (URL nullázása)
 */
app.delete('/api/epuletek/:id', async (req, res) => {
    try {
        await db.query('UPDATE epulet SET kep_url = NULL WHERE id = ?', [req.params.id]);
        res.json({ message: 'Kép sikeresen törölve!' });
    } catch (err) {
        res.status(500).json({ message: 'Hiba a kép törlésekor' });
    }
});

// ═════════════════════════════════════════════════════════════════
// SZERVER INDÍTÁSA
// ═════════════════════════════════════════════════════════════════

app.listen(3333, () => {
    console.log('🚀 Server fut a http://localhost:3333 címen');
    console.log('📁 Képek kiszolgálása: /kepek');
});