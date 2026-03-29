# 🏗️ ÉpítészArchívum - Projekt

Egy modern webes alkalmazás az **építészek, épületek és építészati stílusok nyilvántartásához** képkezelés funkcióval.

## 📋 Projekt Célja

Az alkalmazás lehetővé teszi:
- 📚 **Építészek adatainak nyilvántartása** (név, születési év, építészeti stílus)
- 🏢 **Épületek és szobrok katalógusa** (név, város, építési év)
- 🖼️ **Képek felhasználása és nyilvántartása** az épületekhez
- 🔗 **Kapcsolatok kezelése** az építészek és épületek között

Ideális használat: építészettörténeti tanulmányok, visszakeresés, képes dokumentáció.

---

## 🛠️ Technológiai Stack

| Terület | Technológia | Verzió |
|--------|-------------|--------|
| **Backend** | Node.js + Express | 5.2.1 |
| **Frontend** | React + Vite | 19.2.4 + 8.0.1 |
| **Adatbázis** | MySQL | 8.0.40 |
| **UI Framework** | React-Bootstrap | 2.10.10 |
| **Képfeltöltés** | Multer | 2.1.1 |
| **API Kommunikáció** | Fetch API | - |

---

## 📁 Projekt Szerkezete

```
epiteszek/
├── README.md                          # Ez a fájl (projekt leírása)
├── epiteszek.sql                      # Adatbázis séma exportja
│
├── backend/
│   ├── README.md                      # Backend API dokumentáció
│   ├── server.js                      # Express szerver (API végpontok)
│   ├── package.json                   # Node.js függőségek
│   └── public/kepek/                  # Feltöltött képek
│
└── frontend/
    ├── README.md                      # Frontend alkalmazás dokumentáció
    ├── package.json                   # React függőségek
    ├── vite.config.js                 # Vite beállítások
    ├── index.html                     # HTML belépési pont
    └── src/
        ├── main.jsx                   # React belépési pont
        ├── App.jsx                    # Főkomponens
        ├── App.css                    # Globális stílusok
        └── komponens/                 # UI komponensek
            ├── Navigacio.jsx          # Felső navigációs sáv
            ├── EpuletLista.jsx        # Épületek táblázata
            ├── EpiteszHozzaadasa.jsx  # Építész hozzáadás form
            ├── KepHozzaadasa.jsx      # Kép feltöltés form
            ├── KepFeltoltes.jsx       # Kép feltöltés UI
            └── VizsgaFigyelmeztetes.jsx # Vizsgafelkészültség banner
```

---

## 🗄️ Adatbázis Szerkezete

### Táblák

#### `epitesz` - Építészek
```sql
CREATE TABLE epitesz (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nev VARCHAR(100) NOT NULL,
  szulev INT,
  stilus VARCHAR(100)
);
```
**Adatok**: Neve, születési éve és építészeti stílusa

#### `epulet` - Épületek és szobrok
```sql
CREATE TABLE epulet (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nev VARCHAR(100) NOT NULL,
  varos VARCHAR(100),
  epult INT,
  kep_url VARCHAR(255)
);
```
**Adatok**: Neve, város, építési év, képURL

#### `kapcsolat` - Kapcsolatok (Many-to-Many)
```sql
CREATE TABLE kapcsolat (
  epulet_id INT,
  epitesz_id INT,
  FOREIGN KEY (epulet_id) REFERENCES epulet(id),
  FOREIGN KEY (epitesz_id) REFERENCES epitesz(id)
);
```
**Cél**: Egy épületnek több építésze lehet, egy építésznek több épülete

---

## 🚀 Telepítés és Futtatás

### 1️⃣ Előkészítés

```bash
# Projekt klónozása
cd epiteszek

# Backend függőségek
cd backend
npm install

# Frontend függőségek
cd ../frontend
npm install
```

### 2️⃣ Adatbázis létrehozása

```bash
# MySQL adatbázis importálása
mysql -u root -p < epiteszek.sql

# vagy phpMyAdmin-en keresztül
# 1. Import -> epiteszek.sql kiválasztása
# 2. Execute
```

### 3️⃣ Backend indítása

```bash
cd backend
npm start
# Elérhető: http://localhost:3333
```

### 4️⃣ Frontend indítása

```bash
cd frontend
npm run dev
# Elérhető: http://localhost:5173
```

---

## 📖 Részletes Dokumentáció

- **[Backend README](./backend/README.md)** - API végpontok, fejlesztői útmutató
- **[Frontend README](./frontend/README.md)** - Komponensek, felhasználói felület

---

## 🔧 Fejlesztői Megjegyzések

### Adatbázis Kapcsolat Beállítása

**Backend** `server.js`:
```javascript
const db = mysql.createPool({
    host: 'localhost',
    port: 3307,           // ⚠️ XAMPP: 3306, MAMP: 3307
    user: 'root',
    password: 'root',     // ⚠️ Ellenőrizd a jelszót
    database: 'epiteszet'
});
```

### Képfeltöltés

- **Maximális méret**: 5 MB
- **Támogatott formátumok**: JPG, JPEG, PNG, GIF, WebP
- **Tár helye**: `backend/public/kepek/`

---

## 🎓 Tanulási Célok

Ez egy gyakorló projekt a következő technológiák megismeréséhez:

✅ **Backend**: Express.js REST API fejlesztés  
✅ **Frontend**: React komponens-alapú fejlesztés  
✅ **Adatbázis**: MySQL queries, relációs adatmodell  
✅ **Fájlkezelés**: Multer képfeltöltés  
✅ **UI**: React-Bootstrap responsive design  

---

## 📝 Licensz

Oktatási célokra készült projekt.

---

## 👨‍💻 Szerzõ

*Készült: 2026. március*
  "stilus": "Organikus",
  "varos": "New York",
  "epulet_nev": "Guggenheim Múzeum"
}
Response: {
  "message": "Építész (és első épülete) sikeresen hozzáadva!",
  "id": 4
}
```

**POST /api/upload** - Kép feltöltése
```
Request: FormData { kep: File }
Response: {
  "message": "Kép sikeresen feltöltve!",
  "fileName": "photo-1234567890.jpg",
  "fileUrl": "/kepek/photo-1234567890.jpg"
}
```

**PUT /api/epuletek/:id** - Épület adatainak módosítása
```json
Request: {
  "nev": "Új név",
  "varos": "Város",
  "epult": 2025
}
Response: {
  "message": "Épület adatai sikeresen frissítve!"
}
```

**PUT /api/epuletek/:id/kep** - Kép URL és építési év hozzárendelése
```json
Request: {
  "kep_url": "/kepek/photo.jpg",
  "epult": 2025
}
Response: {
  "message": "Adatok sikeresen frissítve!"
}
```

**DELETE /api/epuletek/:id** - Kép törlése (URL nullázása)
```
Response: {
  "message": "Kép sikeresen törölve!"
}
```

---

## ⚛️ Frontend Komponensek

### Stack: React 19 + Vite + React-Bootstrap

#### Komponensek (`src/komponens/`)

| Komponens | Fájl | Funkció |
|-----------|------|---------|
| **Navigáció** | `Navigacio.jsx` | Felső navbar, nézetek közötti navigáció |
| **Épületek Listája** | `EpuletLista.jsx` | Összes épület táblázatban, szerkesztés, képmódosítás |
| **Építész Hozzáadása** | `EpiteszHozzaadasa.jsx` | Form új építész és épülete rögzítéséhez |
| **Kép Feltöltése** | `KepFeltoltes.jsx` | Kép megadása (file vagy URL), max 5MB |
| **Kép Hozzáadása** | `KepHozzaadasa.jsx` | Kép hozzárendelése épülethez szűrőkkel |
| **Vizsga Figyelmeztetés** | `VizsgaFigyelmeztetes.jsx` | Gyakorló üzemmód jelzése |

#### Funkciók:

- **Nézet-kezelés:** Alkalmazás-szintű state-management (home, list, add-architect, stb.)
- **Form-kezelés:** Bootstrap formok validációval
- **API Kommunikáció:** Fetch API-val szinkron és aszinkron műveletek
- **Kép-kezelés:** Előnézet, szűrés (jpg, png, webp stb), max 5MB
- **Szerkesztés:** Inline szerkesztés táblázatban, mentés a backend felé
- **Szűrések:** Építészenként, városonként, épületekenként

---

## 📦 Függőségek

### Backend (`backend/package.json`)

```json
{
  "dependencies": {
    "cors": "^2.8.6",           // Cross-Origin Resource Sharing
    "express": "^5.2.1",        // Web keretrendszer
    "multer": "^2.1.1",         // Fájlfeltöltés kezelése
    "mysql2": "^3.20.0",        // MySQL kliens
    "nodemon": "^3.1.14"        // Fejlesztés alatt automatikus restart
  }
}
```

### Frontend (`frontend/package.json`)

```json
{
  "dependencies": {
    "bootstrap": "^5.3.8",           // CSS keretrendszer
    "react": "^19.2.4",              // JavaScript könyvtár
    "react-bootstrap": "^2.10.10",   // Bootstrap React komponensek
    "react-dom": "^19.2.4"           // React DOM rendering
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "vite": "^8.0.1"
  }
}
```

---

## 🚀 Telepítés és Futtatás

### 1. Adatbázis Beállítása

```bash
# MySQL bejelentkezés
mysql -u root -proot

# Adatbázis importálása
source epiteszek.sql;
```

> **Megjegyzés:** A szerver az `epiteszet` adatbázist keresi `root:root` jelszóval a `localhost:3307` porton (MAMP esetén). Szerkeszd a `backend/server.js`-t igény szerint!

### 2. Backend Indítása

```bash
cd backend
npm install
npm start
# vagy fejlesztéshez: npx nodemon server.js
```

**Elvárt kimenet:**
```
🚀 Server fut a http://localhost:3333 címen
📁 Képek kiszolgálása: /kepek
```

### 3. Frontend Indítása

```bash
cd frontend
npm install
npm run dev
# Megnyílik: http://localhost:5173/
```

---

## 📝 Használati Esetek

### 1. **Építész Rögzítése**
- Ugorj a "Új építész" oldalra az EpiteszHozzaadasa komponensbem
- Töltsd ki a nevet, születési évet, stílust, várost és az első épület nevét
- Az alkalmazás automatikusan lexretölja az épületeket és a kapcsolatokat

### 2. **Kép Feltöltése és Hozzárendelése**
- "Kép hozzáadása" oldalon válassz építészt, várost, épületet
- Töltsd fel a képet (max 5MB, jpg/png/gif/webp)
- Az épület kép_url mezője frissül

### 3. **Épület Módosítása**
- Az "Épületek" oldalon kattints a szerkesztés gombra
- Módosítsd az adatokat inline
- Kattints a "Mentés" gombra

---

## 🛠️ Technikai Részletek

### API Hitelesítés
- **Jelenleg:** Nincs hitelesítés
- **Javasolt:** JWT token az üzemi verzióhoz

### Képtárolás
- **Helye:** `backend/public/kepek/`
- **Elérés:** `http://localhost:3333/kepek/filename.jpg`
- **Namnév generálása:** `originalname-timestamp-random.ext`

### CORS Beállítás
- Az alkalmazás **összes forrásról** fogad kéréseket (`*`)
- Frontend és backend különböző portokon futnak (3333 és 5173)

### Validáció
- **Backend:** Input ellenőrzés (kötelező mezők)
- **Frontend:** Fájltípus, méretkorlát (5MB)

---

## 📊 Jelenlegi Adatok

Az alkalmazás 3 híres magyar építészekkel indul:
- **Steindl Imre** (1839) - Neogótikus stílus - Országház
- **Ybl Miklós** (1814) - Neoreneszánsz - Operaház
- **Lechner Ödön** (1845) - Szecesszió - Iparművészeti Múzeum

---

## 🎓 Gyakorló Üzemmód

Ez a projekt a **HTML/CSS/JS vizsga gyakorlásához** készült. A komponens az összes lehetséges technológiát tartalmazza, de a valódi vizsgán nem kell mindegyik egyszerre.

**Legfontosabbak:**
- ✅ Backend API végpontok (GET, POST, PUT, DELETE)
- ✅ Frontend komponensek (React)
- ✅ Adatbázis sémája és lekérdezési logika
- ✅ Képfeltöltés (Multer, FormData)
- ✅ Szerkesztési funkciók

---

## 📌 Megjegyzések a Fejlesztéshez

- **Képek:** A feltöltött képeket nem gyöngítettük, figyelj a tárhely-felhasználásra
- **MySQL Port:** XAMPP=3306, MAMP=3307. Szerkeszd a `server.js`-t ha szükséges
- **Frontend Build:** `npm run build` az üzemi verzióhoz
- **Logging:** Hozzáadhatsz további console.log() utasításokat debuggoláshoz

---

## 📄 Fájlok Felépítése

```
backend/server.js          → API végpontok + middleware
frontend/src/App.jsx       → Fő nézet-kezelés
frontend/src/main.jsx      → React init
frontend/src/komponens/*   → Moduláris komponensek
epiteszek.sql              → Adatbázis sémája
```

---

## 🎯 Gyakorlási Tippek

1. **Végpontok tesztelése:** Postman vagy curl-lel
2. **Komponensek módosítása:** Bootstrap classesekkel
3. **Adatbázis bővítése:** Új oszlopok/táblák hozzáadása
4. **Error handling:** Egészítsd ki más hibakezeléseket
5. **Validáció erősítése:** Több mezőhöz adatbázis szintű vinculum

---

**Készült:** 2026. március 29. | **Verzió:** 1.0
