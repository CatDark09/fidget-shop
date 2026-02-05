# 3D Printed Fidget Shop

Egy modern, reszponzív webshop 3D nyomtatott fidget termékekhez.

## Funkciók

- 🎨 Modern, reszponzív design
- 📱 Mobil-barát felület
- 🛍️ Termék galéria böngészéshez
- 📧 Kapcsolatfelvételi űrlap email küldéssel
- ✨ Smooth scroll animációk
- 🎯 Könnyű navigáció

## Használat

1. **Email cím beállítása**
   - Nyisd meg a `script.js` fájlt
   - Keress rá erre a sorra: `mailto:your-email@example.com`
   - Cseréld ki `your-email@example.com`-et a saját email címedre

2. **Termékek szerkesztése**
   - Nyisd meg az `index.html` fájlt
   - A termékek a `products-grid` div-ben találhatók
   - Módosíthatod a termékek nevét, leírását és ikonját

3. **Színek testreszabása**
   - Nyisd meg a `styles.css` fájlt
   - A `:root` részben módosíthatod a színeket:
     - `--primary-color`: Fő szín
     - `--secondary-color`: Másodlagos szín
     - Egyéb színek is testreszabhatók

## Fájlok

- `index.html` - Fő HTML struktúra
- `styles.css` - Stílusok és design
- `script.js` - JavaScript funkcionalitás
- `README.md` - Ez a fájl

## Email beállítás (Opcionális - Fejlettebb megoldás)

Ha szeretnél egy fejlettebb email megoldást (pl. EmailJS, Formspree, stb.), akkor:

1. **EmailJS használata:**
   - Regisztrálj az [EmailJS](https://www.emailjs.com/)-re
   - Állítsd be a szolgáltatást
   - Frissítsd a `script.js` fájlt az EmailJS kóddal

2. **Formspree használata:**
   - Regisztrálj a [Formspree](https://formspree.io/)-re
   - Módosítsd a form action-t a Formspree URL-re

## Telepítés és futtatás

Egyszerűen nyisd meg az `index.html` fájlt egy böngészőben. Nincs szükség telepítésre vagy build folyamatra.

## Bővítési lehetőségek

- Képgaléria hozzáadása a termékekhez
- Árlista megjelenítése
- Kosár funkció (ha később e-commerce-t szeretnél)
- Admin felület rendelések kezeléséhez
- Termék részletek oldal

## Licenc

Személyes használatra készült.
