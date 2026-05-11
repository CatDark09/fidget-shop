# AI Fejlesztési Szabályok - 3D Fidget Shop

Ez a dokumentum összefoglalja a projekt technológiai hátterét és a kódolási irányelveket.

## Technológiai Stack
- **Frontend:** Vanilla HTML5, CSS3 és JavaScript (ES6+).
- **3D Megjelenítés:** Three.js (v128+) STL és 3MF betöltőkkel.
- **Backend/API:** Cloudflare Pages Functions (Node.js runtime).
- **Email Küldés:** Resend API integráció a backend oldalon.
- **Tipográfia:** Google Fonts (Poppins).
- **Design:** Egyedi CSS Grid és Flexbox alapú reszponzív elrendezés.
- **Ikonok:** Emojik és Lucide-react (opcionális).

## Fejlesztési Szabályok
- **3D Logika:** Minden 3D-vel kapcsolatos műveletet a `viewer.js` fájlban lévő `FidgetViewer` osztályon keresztül kell végezni.
- **UI Logika:** A `script.js` felelős az eseménykezelésért, a modális ablakokért és a színek listázásáért.
- **Nyelv:** A felhasználói felületnek (UI) magyar nyelvűnek kell maradnia.
- **Stílus:** Használd a `styles.css`-ben definiált CSS változókat (`--primary-color`, stb.) a konzisztencia érdekében.
- **Modellek:** Az új 3D modelleket a `models/` mappába, a képeket az `images/` mappába kell helyezni.
- **Reszponzivitás:** Minden új UI elemet mobil-barát módon kell megtervezni.