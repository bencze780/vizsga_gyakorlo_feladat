# ⚛️ Frontend Alkalmazás - ÉpítészArchívum

React + Vite alapú webes alkalmazás az ÉpítészArchívum építészeti katalógushoz.

---

## 📦 Technológiák

| Csomag | Verzió | Cél |
|--------|--------|-----|
| `react` | ^19.2.4 | UI library és komponensek |
| `vite` | ^8.0.1 | Build eszköz és dev szerver |
| `react-bootstrap` | ^2.10.10 | Bootstrap komponensek |
| `bootstrap` | ^5.3.8 | CSS keretrendszer |
| `react-dom` | ^19.2.4 | React DOM rendering |

---

## 🚀 Indítás

```bash
# Frontend mappába lépés
cd frontend

# Függőségek telepítése
npm install

# Fejlesztési szerver indítása
npm run dev

# Szerver elérhető: http://localhost:5173
```

### Production Build

```bash
# Optimalizált bundle létrehozása
npm run build

# Preview az elkészült buildből
npm run preview
```

---

## 📁 Projekt Szerkezete

```
frontend/
├── src/
│   ├── main.jsx                    # React belépési pont
│   ├── App.jsx                     # Fõkomponens (Router logika)
│   ├── App.css                     # Globális stílusok
│   ├── assets/                     # Képek, ikonok, media
│   └── komponens/                  # React komponensek
│       ├── Navigacio.jsx           # Felső navbar
│       ├── EpuletLista.jsx         # Épületek táblázata
│       ├── EpiteszHozzaadasa.jsx   # Építész hozzáadás form
│       ├── KepHozzaadasa.jsx       # Kép feltöltés form
│       ├── KepFeltoltes.jsx        # Kép feltöltés UI
│       └── VizsgaFigyelmeztetes.jsx # Vizsgafelkészültség banner
├── index.html                      # HTML fõ sablon
├── package.json                    # Függőségek és scripts
├── vite.config.js                  # Vite beállítások
└── eslint.config.js                # ESLint kódminőség szabályok
```

---

## 🧩 Komponensek Dokumentáció

### 1️⃣ **Navigacio.jsx** - Felső Navigációs Sáv

```javascript
import { Navigacio } from './komponens/Navigacio';

// Használat
<Navigacio aktualisNezet={nézet} setNezet={setNezet} />
```

**Props**:
- `aktualisNezet` (string) - Jelenleg aktív nézet ('home', 'list', 'add-architect', 'add-image')
- `setNezet` (function) - Nézet módosító callback

**Funkciók**:
- 🏠 **Kezdőlap** - Home nézetre ugrás
- 📋 **Épületek** - Összes épület listázása
- ➕ **Új Építész** - Építész hozzáadása form
- 🖼️ **Képfeltöltés** - Kép feltöltés form
- 📱 Mobile responsív navbar

---

### 2️⃣ **EpuletLista.jsx** - Épületek Táblázata

```javascript
import { EpuletLista } from './komponens/EpuletLista';

// Használat
<EpuletLista epuletek={epuletek} apiUrl={apiUrl} />
```

**Props**:
- `epuletek` (array) - Épületek adatai
- `apiUrl` (string) - Backend API URL (pl. "http://localhost:3333/api")

**Funkciók**:
- 📊 **Táblázat megjelenítés** - Épületre adatok strukturált táblában
- ✏️ **Szerkesztés** - Épület adatainak  módosítása (inline editing)
- 🖼️ **Képek kezelése** - Kép feltöltés és hozzárendelés épülethez
- 🗑️ **Kép törlés** - Tárolt képek eltávolítása
- 📱 **Adatok frissítés** - Automatikus page reload sikeres módosítás után

---

### 3️⃣ **EpiteszHozzaadasa.jsx** - Építész Hozzáadása Form

```javascript
import { EpiteszHozzaadasa } from './komponens/EpiteszHozzaadasa';

// Használat
<EpiteszHozzaadasa 
  apiUrl={apiUrl}
  onSiker={handleSiker}
  onHiba={handleHiba}
  setNezet={setNezet}
  frissites={frissites}
/>
```

**Form mezői**:
- 👤 **Építész Neve** (kötelező)
- 🎂 **Születési Év** (opcionális)
- 🎨 **Építészeti Stílus** (pl. "Neogótikus", "Szecesszió")
- 🏙️ **Város** (kötelező)
- 🏛️ **Épület/Szobor Neve** (kötelező)

**API hívás**:
```
POST /api/epiteszek
{
  "nev": "Lechner Ödön",
  "szulev": 1845,
  "stilus": "Szecesszió",
  "varos": "Budapest",
  "epulet_nev": "Iparművészeti Múzeum"
}
```

---

### 4️⃣ **KepHozzaadasa.jsx** - Kép Feltöltés Form

```javascript
import { KepHozzaadasa } from './komponens/KepHozzaadasa';

// Használat
<KepHozzaadasa 
  epuletek={epuletek}
  epiteszek={epiteszek}
  apiUrl={apiUrl}
  onSiker={handleSiker}
  onHiba={handleHiba}
  frissites={frissites}
/>
```

**Funkciók**:
- 🔍 **Szűrés** - Építész → Város → Épület
- 📁 **Fájl feltöltés** vagy **URL megadása**
- 🖼️ **Képelőnézet**
- 📊 **Upload progress bar**
- ⚡ **Automatikus adatbázis frissítés**

---

### 5️⃣ **KepFeltoltes.jsx** - Kép Feltöltés UI

```javascript
import { KepFeltoltes } from './komponens/KepFeltoltes';

// Használat
<KepFeltoltes epuletId={epuletId} apiUrl={apiUrl} />
```

**Funkciók**:
- 📁 **Fájl input** - Kép kiválasztása
- 🖼️ **Előnézet** - Kiválasztott kép előnézetea
- 📤 **Feltöltés** - Multipart/form-data POST
- ✅ **Validáció** - Csak képfájlok, max 5MB

---

### 6️⃣ **VizsgaFigyelmeztetes.jsx** - Vizsgafelkészültség Banner

```javascript
import { VizsgaFigyelmeztetes } from './komponens/VizsgaFigyelmeztetes';

// Használat
<VizsgaFigyelmeztetes />
```

**Funkciók**:
- ⚠️ **Figyelmeztetés banner** - Vizsgafelkészültségre emlékeztetõ
- 🎓 **Tanulmányi tippek** - Készülkedési javaslatok
- 📚 **Tanulás útmutató** - Építészettörténet tanulásához

---

## 🎨 Stílusok és Layout

### Bootstrap Komponensek
```javascript
import { Table, Button, Form, Alert, Navbar, Container } from 'react-bootstrap';
```

---

## 🔗 API Integrációs Pontok

### GET végpontok
```javascript
// Épületek lekérése
const response = await fetch(`${apiUrl}/epuletek`);
const epuletek = await response.json();

// Építészek lekérése
const response = await fetch(`${apiUrl}/epiteszek`);
const epiteszek = await response.json();
```

### POST végpontok
```javascript
// Új építész
const res = await fetch(`${apiUrl}/epiteszek`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ujEpitesz)
});

// Kép feltöltése
const formData = new FormData();
formData.append('kep', file);
const res = await fetch(`${apiUrl}/upload`, {
  method: 'POST',
  body: formData
});
```

### PUT és DELETE végpontok
```javascript
// Épület módosítása
const res = await fetch(`${apiUrl}/epuletek/${epuletId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(szerkesztesAdatok)
});

// Kép törlése
const res = await fetch(`${apiUrl}/kepek/${filename}`, {
  method: 'DELETE'
});
```

---

## 🛠️ Fejlesztői Eszközök

### ESLint Kódminőség Ellenõrzés
```bash
npm run lint
```

### Build Parancsok
```bash
npm run dev      # Fejlesztési szerver
npm run build    # Production build
npm run preview  # Build preview
```

---

## 🐛 Gyakori Hibák és Megoldások

### 1. Képek nem töltődnek be
```
Hiba: 404 Not Found /kepek/image.jpg
Megoldás: Ellenõrizze, hogy a backend /kepek route-ja elérhető
```

### 2. CORS hiba
```
Hiba: Access to XMLHttpRequest blocked by CORS policy
Megoldás: Ensure backend app.use(cors()); van a server.js-ben
```

### 3. API kérések nem működnek
```
Hiba: Failed to fetch
Megoldás: Ellenõrizze, hogy backend fut a http://localhost:3333-n
```

---

## 🎓 Tanulási Célok

✅ React komponens-alapú fejlesztés  
✅ Vite build eszköz  
✅ Bootstrap responsive design  
✅ Fetch API frontend API kommunikáció  
✅ Form kezelés és validáció  
✅ State management (useState, useEffect)
