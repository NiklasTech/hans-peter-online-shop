# 🛒 Allrounder Online-Shop (Projektbeschreibung)

Ein moderner Allrounder-Shop ähnlich wie Amazon, inklusive Live-Chat, Warenkorb, Nutzerbereich und Admin-Funktionen.  
Alle Zahlungsprozesse basieren auf **Mock-Daten** (keine echten Transaktionen).

---

## 📦 Hauptfunktionen

### 🗂️ Produktkatalog
- Kategorien & Unterkategorien  
- Produktdetails mit Bildern, Beschreibung, Preis, Lagerstatus  
- Suchfunktion & Filter  

### 🛒 Warenkorb
- Produkte hinzufügen / entfernen  
- Mengen anpassen  
- Zwischensumme, Versandkosten (mock)  
- Speicherung des Warenkorbs im LocalStorage oder Datenbank  

### 💳 Bezahlvorgang (Mock)
- Checkout-Prozess  
- Zahlungsarten simulieren (Kreditkarte, PayPal, Klarna → nur Mock)  
- Bestellübersicht  
- Bestellbestätigung (Mail optional)  

### 💬 Live-Chat
- Echtzeit Chat mit Support (z. B. Websocket, Firebase, oder Fake-Chat)  
- Automatische Antworten möglich  
- Chatverlauf speichern  

---

## 👤 Nutzerbereich

### Registrierung & Login
- E-Mail + Passwort  
- Passwort-Hashing  
- Validierung  
- Session- oder JWT-Auth  

### User Dashboard
- Persönliche Daten  
- Bestellübersicht  
- Adressen speichern  
- Wunschliste  
- Bewertungen

---

## 🛠️ Mitarbeiter- / Admin-Bereich

### Admin Login
- Separater Login-Bereich  
- Rollensystem: User / Admin / Mitarbeiter  

### Admin-Funktionen
- 📊 Dashboard mit Statistiken (Sales Mock-Daten)
- 📦 Produkte anlegen, bearbeiten, löschen  
- 🖼️ Produktbilder verwalten  
- 👥 Nutzerübersicht  
- 🛒 Bestellungen einsehen (Mock-Daten)  

---

## 🌟 Erweiterbare Features (optional, falls Zeit)

### 📰 CMS (Content Management System)
- Werbebanner verwalten  
- Textelemente auf Startseite ändern  
- Slider / Promo-Bereiche konfigurierbar  

### 👍 UX / Nutzerfreundlichkeit
- Responsives Design  
- Dark Mode  
- Schneller Checkout  
- Schnellsuche (Search-as-you-type)  
- Barrierefreiheit (A11y)  

### 🔍 Weitere mögliche Features
- Bewertungen & Rezensionen  
- Produktvergleiche  
- Rabattcodes (Mock)  
- Mehrsprachigkeit  
- Newsletter-Anmeldung  

---

## 🧱 Technische Struktur (Vorschlag)

### Frontend
- React / Next.js / Vue  
- TailwindCSSs  
- Zustand / Redux / Context API  

### Backend
- Node.js (Express / NestJS)  
- Authentifizierung (JWT oder Sessions)  
- Mock-Daten über JSON oder  

### Datenbank
- PostgreSQL / MongoDB **oder** reine Mock-DB während des Projekts  

### Realtime
- WebSockets oder Firebase für Chat  
- Faker.js
- 

---

## 🎯 Projektziel
Ein voll funktionsfähiger, aber nicht realer Online-Shop mit Mock-Zahlungssystem, Benutzerverwaltung und Admin-Interface.  
Ideal als Abschlussprojekt, Portfolio oder Lernprojekt.

