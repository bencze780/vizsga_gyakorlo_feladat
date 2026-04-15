# 🏗️ ÉpítészArchívum - Projekt

Egy modern webes alkalmazás az **építészek, épületek és építészeti stílusok nyilvántartásához**, kiegészítve képkezeléssel és kapcsolatok kezelésével.

## 📋 Projekt célja

Az alkalmazás támogatja:
- 📚 Építészek adatait (név, születési év, stílus)
- 🏢 Épületek és szobrok katalógusát (név, város, építési év)
- 🖼️ Képek feltöltését és hozzárendelését épületekhez
- 🔗 Kapcsolatok tárolását építészek és épületek között

---

## 🛠️ Technológiai stack

| Terület | Technológia | Verzió |
|--------|-------------|--------|
| Backend | Node.js + Express | 5.2.1 |
| Frontend | React + Vite | 19.2.4 + 8.0.1 |
| Adatbázis | MySQL | 8.0.x |
| UI | React-Bootstrap + Bootstrap | 2.10.10 + 5.3.8 |
| Képfeltöltés | Multer | 2.1.1 |
| API kommunikáció | Fetch API | - |

---

## 📁 Projekt struktúra

```
/Users/benczeistvan/Desktop/vizsga_gyakorlo_feladat
├── README.md
├── epiteszek.sql
├── backend/
│   ├── README.md
│   ├── server.js
│   ├── package.json
│   ├── integration.test.js
│   ├── mock-integration.test.js
│   ├── sum.test.js
│   ├── unit.test.js
│   ├── public/
│   │   └── kepek/
│   └── ...
└── frontend/
    ├── README.md
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        ├── assets/
        └── komponens/
            ├── EpiteszHozzaadasa.jsx
            ├── EpuletLista.jsx
            ├── FelhasznaltIrodalom.jsx
            ├── KepFeltoltes.jsx
            ├── KepHozzaadasa.jsx
            ├── Navigacio.jsx
            ├── TestRunner.jsx
            └── VizsgaFigyelmeztetes.jsx
```

---

## 🗄️ Adatbázis séma

### `epitesz`

```sql
CREATE TABLE epitesz (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nev VARCHAR(100) NOT NULL,
  szulev INT,
  stilus VARCHAR(100)
);
```

### `epulet`

```sql
CREATE TABLE epulet (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nev VARCHAR(100) NOT NULL,
  varos VARCHAR(100),
  epult INT,
  kep_url VARCHAR(255)
);
```

### `kapcsolat`

```sql
CREATE TABLE kapcsolat (
  epulet_id INT,
  epitesz_id INT,
  FOREIGN KEY (epulet_id) REFERENCES epulet(id),
  FOREIGN KEY (epitesz_id) REFERENCES epitesz(id)
);
```

---

## 🚀 Telepítés és futtatás

### 1. Backend és frontend függőségek telepítése

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Adatbázis importálása

```bash
mysql -u root -p < epiteszek.sql
```

### 3. Backend indítása

```bash
cd backend
npm start
```

A szerver elérhető: `http://localhost:3333`

### 4. Frontend indítása

```bash
cd frontend
npm run dev
```

A front-end elérhető: `http://localhost:5173`

---

## 📡 Backend API főbb végpontok

- `GET /api/epuletek` – az összes épület lekérése kapcsolódó építész információval
- `GET /api/epiteszek` – az összes építész adatai
- `GET /api/images-list` – feltöltött képek listája a `backend/public/kepek/` mappából
- `POST /api/epiteszek` – új építész és opcionálisan az első épület létrehozása
- `POST /api/upload` – képfeltöltés `multipart/form-data` formban (`kep` mező)
- `PUT /api/epuletek/:id` – épület adatok frissítése
- `PUT /api/epuletek/:id/kep` – kép URL és építési év hozzárendelése egy épülethez
- `DELETE /api/epuletek/:id` – épület kép URL-jének törlése (nullázás)

### Példa: új építész hozzáadása

```json
POST /api/epiteszek
{
  "nev": "Lechner Ödön",
  "szulev": 1845,
  "stilus": "Szecesszió",
  "varos": "Budapest",
  "epulet_nev": "Iparművészeti Múzeum"
}
```

### Példa: kép feltöltése

```
POST /api/upload
Content-Type: multipart/form-data
FormData: kep=<file>
```

---

## 🧩 Frontend funkciók

- React + Vite alapú felhasználói felület
- Bootstrap és React-Bootstrap komponensek
- Épületek listázása, szerkesztése és képek hozzárendelése
- Új építész és épület felvétele egy helyen
- Képek feltöltése és kezelése (max 5 MB, JPG/JPEG/PNG/GIF/WebP)
- Mobilbarát nézet és egyszerű navigáció

---

## 🧪 Tesztek

A backendben elérhető teszt parancsok:

```bash
cd backend
npm test
npm run test:sum
npm run test:unit
npm run test:integration
npm run test:mock
```

---

## 🔧 Fontos beállítások

- A backend MySQL kapcsolat `server.js`-ben van beállítva: `host: localhost`, `port: 3307`, `user: root`, `password: root`, `database: epiteszet`
- A backend képeket a `backend/public/kepek/` mappában tárolja
- A frontend `npm run dev` parancs után a böngészőn keresztül érhető el
- A backend és frontend külön porton fut: `3333` és `5173`

---

## 📖 Dokumentáció

- Backend: `backend/README.md`
- Frontend: `frontend/README.md`
