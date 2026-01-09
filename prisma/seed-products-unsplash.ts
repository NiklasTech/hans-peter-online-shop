import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker/locale/de';
import { createClient } from 'pexels';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// Pexels API initialisieren (optional - funktioniert auch ohne API Key mit Placeholder)
const pexels = process.env.PEXELS_API_KEY
  ? createClient(process.env.PEXELS_API_KEY)
  : null;

// Kategorien für den Shop
const CATEGORIES = [
  { name: 'Elektronik', description: 'Smartphones, Tablets, Computer und mehr', keywords: ['laptop', 'smartphone', 'technology', 'electronics'] },
  { name: 'Mode', description: 'Kleidung, Schuhe und Accessoires', keywords: ['fashion', 'clothing', 'shoes', 'accessories'] },
  { name: 'Haushalt', description: 'Küche, Bad und Wohnzimmer', keywords: ['furniture', 'kitchen', 'home', 'interior'] },
  { name: 'Sport', description: 'Sportgeräte und Fitness', keywords: ['sports', 'fitness', 'exercise', 'gym'] },
  { name: 'Bücher', description: 'Romane, Sachbücher und mehr', keywords: ['books', 'reading', 'library'] },
  { name: 'Spielzeug', description: 'Spielzeug für Kinder jeden Alters', keywords: ['toys', 'kids', 'play', 'children'] },
  { name: 'Garten', description: 'Gartengeräte und Pflanzen', keywords: ['garden', 'plants', 'outdoor', 'flowers'] },
  { name: 'Automobile', description: 'Autozubehör und Werkzeug', keywords: ['car', 'automotive', 'vehicle', 'tools'] },
  { name: 'Beauty', description: 'Kosmetik und Pflegeprodukte', keywords: ['beauty', 'cosmetics', 'skincare', 'makeup'] },
  { name: 'Lebensmittel', description: 'Lebensmittel und Getränke', keywords: ['food', 'coffee', 'drinks', 'grocery'] },
];

// Spezifische Produktvarianten pro Marke
const BRAND_SPECIFIC_PRODUCTS: Record<string, Record<string, string[]>> = {
  // Elektronik - Grafikkarten
  'NVIDIA': {
    'Grafikkarte': ['GeForce RTX 4090', 'GeForce RTX 4080', 'GeForce RTX 4070 Ti', 'GeForce RTX 4060'],
  },
  'AMD': {
    'Grafikkarte': ['Radeon RX 7900 XTX', 'Radeon RX 7800 XT', 'Radeon RX 7600'],
    'Prozessor': ['Ryzen 9 7950X', 'Ryzen 7 7800X3D', 'Ryzen 5 7600X'],
  },
  'Intel': {
    'Prozessor': ['Core i9-14900K', 'Core i7-14700K', 'Core i5-14600K', 'Core i5-13400F'],
  },
  'ASUS': {
    'Grafikkarte': ['ROG Strix RTX 4090', 'TUF Gaming RTX 4070', 'Dual RTX 4060'],
    'Laptop': ['ROG Zephyrus G14', 'TUF Gaming A15', 'Vivobook Pro 15'],
    'Monitor': ['ROG Swift PG32UQX', 'TUF Gaming VG27AQ', 'ProArt PA278QV'],
    'Mainboard': ['ROG Maximus Z790', 'TUF Gaming B650', 'Prime Z690'],
    'Tastatur': ['ROG Azoth', 'TUF Gaming K7'],
    'Maus': ['ROG Gladius III', 'TUF Gaming M3'],
    'Router': ['ROG Rapture GT-AX11000', 'RT-AX88U'],
  },
  'MSI': {
    'Grafikkarte': ['Gaming X Trio RTX 4090', 'Ventus RTX 4070', 'Gaming RTX 4060'],
    'Laptop': ['Titan GT77', 'Raider GE78', 'Stealth 14 Studio'],
    'Monitor': ['Optix MAG274QRF', 'MPG321UR-QD'],
    'Mainboard': ['MEG Z790 Ace', 'MPG B650 Edge'],
    'Tastatur': ['Vigor GK71 Sonic'],
    'Maus': ['Clutch GM41'],
  },
  'Apple': {
    'Laptop': ['MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air M2'],
    'Smartphone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14'],
    'Tablet': ['iPad Pro 12.9"', 'iPad Air', 'iPad Mini'],
  },
  'Samsung': {
    'Smartphone': ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy A54'],
    'Tablet': ['Galaxy Tab S9 Ultra', 'Galaxy Tab S9', 'Galaxy Tab A9'],
    'Monitor': ['Odyssey G9', 'ViewFinity S9', 'Smart Monitor M8'],
    'Laptop': ['Galaxy Book3 Ultra', 'Galaxy Book3 Pro'],
    'Headset': ['Galaxy Buds2 Pro', 'Galaxy Buds FE'],
    'Drucker': ['Xpress M2020W', 'ProXpress C3060'],
    'Router': ['SmartThings WiFi'],
  },
  'Sony': {
    'Smartphone': ['Xperia 1 V', 'Xperia 5 V', 'Xperia 10 V'],
    'Headset': ['WH-1000XM5', 'WF-1000XM5', 'LinkBuds S'],
    'Webcam': ['Alpha ZV-E10'],
    'Monitor': ['Bravia XR A95K'],
    'Laptop': ['Vaio SX14'],
  },
  'LG': {
    'Smartphone': ['Wing', 'V60 ThinQ'],
    'Tablet': ['G Pad 5'],
    'Monitor': ['UltraGear 27GN950', 'UltraFine 5K'],
    'Laptop': ['Gram 17', 'Gram Style'],
    'Drucker': ['Smart Ink Tank'],
  },
  'Logitech': {
    'Tastatur': ['MX Keys', 'G915 TKL', 'Pop Keys'],
    'Maus': ['MX Master 3S', 'G Pro X Superlight', 'Lift'],
    'Headset': ['G Pro X 2', 'Zone Wireless', 'G733'],
    'Webcam': ['Brio 4K', 'C920', 'StreamCam'],
  },

  // Mode
  'Nike': {
    'Sneaker': ['Air Max 90', 'Air Force 1', 'Dunk Low', 'Jordan 1'],
    'Laufschuhe': ['Pegasus 40', 'Vaporfly 3', 'Zoom Fly 5'],
    'T-Shirt': ['Dri-FIT', 'Sportswear Club', 'Pro'],
    'Jacke': ['Windrunner', 'Tech Fleece', 'Therma-FIT'],
    'Fußball': ['Mercurial', 'Phantom'],
    'Basketball': ['Elite Championship'],
    'Rucksack': ['Brasilia', 'Hoops Elite'],
    'Tasche': ['Heritage', 'Sportswear Essentials'],
  },
  'Adidas': {
    'Sneaker': ['Ultraboost 23', 'Superstar', 'Samba', 'Stan Smith'],
    'Laufschuhe': ['Adizero Boston 12', 'Solarboost 5'],
    'T-Shirt': ['Essentials', 'Tiro', 'Techfit'],
    'Jacke': ['Tiro Track', 'Terrex', 'Z.N.E.'],
    'Fußball': ['Predator', 'Copa'],
  },
  'Levis': {
    'Jeans': ['501 Original', '511 Slim', '505 Regular', '721 High Rise'],
    'Gürtel': ['Classic Leather', 'Reversible'],
  },

  // Haushalt
  'Bosch': {
    'Kaffeemaschine': ['Tassimo Vivy', 'VeroAroma'],
    'Staubsauger': ['Serie 8', 'Athlet ProHygienic'],
    'Wasserkocher': ['Styline TWK8613'],
  },
  'IKEA': {
    'Sofa': ['Ektorp', 'Klippan', 'Kivik'],
    'Tisch': ['Lack', 'Melltorp', 'Ingatorp'],
    'Stuhl': ['Adde', 'Stefan', 'Tobias'],
  },

  // Beauty
  'L\'Oréal': {
    'Lippenstift': ['Color Riche', 'Rouge Signature'],
    'Shampoo': ['Elvital', 'Botanicals'],
  },
  'Maybelline': {
    'Lippenstift': ['SuperStay Matte Ink', 'Color Sensational'],
    'Mascara': ['Sky High', 'Lash Sensational'],
  },

  // Lebensmittel
  'Nestlé': {
    'Kaffee': ['Nescafé Gold', 'Nespresso'],
    'Schokolade': ['KitKat', 'Smarties'],
  },
  'Milka': {
    'Schokolade': ['Alpenmilch', 'Noisette', 'Oreo'],
  },
  'Jacobs': {
    'Kaffee': ['Krönung', 'Meisterröstung', 'Gold'],
  },
};

// Fallback Mapping für Produkte ohne spezifische Varianten
const PRODUCT_BRAND_MAPPING: Record<string, string[]> = {
  'Laptop': ['ASUS', 'MSI', 'Apple', 'Samsung', 'LG', 'Sony'],
  'Smartphone': ['Apple', 'Samsung', 'Sony', 'LG'],
  'Tablet': ['Apple', 'Samsung', 'LG'],
  'Monitor': ['ASUS', 'MSI', 'Samsung', 'LG', 'Sony'],
  'Tastatur': ['Logitech', 'ASUS', 'MSI'],
  'Maus': ['Logitech', 'ASUS', 'MSI'],
  'Headset': ['Logitech', 'Sony', 'Samsung'],
  'Webcam': ['Logitech', 'Sony'],
  'Drucker': ['Samsung', 'LG'],
  'Router': ['ASUS', 'Samsung'],
  'Grafikkarte': ['NVIDIA', 'AMD', 'ASUS', 'MSI'],
  'Prozessor': ['Intel', 'AMD'],
  'Mainboard': ['ASUS', 'MSI'],

  // Mode
  'Sneaker': ['Nike', 'Adidas', 'Puma'],
  'T-Shirt': ['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Tommy Hilfiger', 'Calvin Klein'],
  'Hemd': ['H&M', 'Zara', 'Tommy Hilfiger', 'Calvin Klein'],
  'Jeans': ['Levis', 'H&M', 'Zara', 'Tommy Hilfiger', 'Calvin Klein'],
  'Jacke': ['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Tommy Hilfiger'],
  'Gürtel': ['Levis', 'Tommy Hilfiger', 'Calvin Klein', 'H&M'],
  'Stiefel': ['Nike', 'Adidas', 'Tommy Hilfiger'],
  'Tasche': ['Nike', 'Adidas', 'Puma', 'Tommy Hilfiger', 'Calvin Klein'],
  'Rucksack': ['Nike', 'Adidas', 'Puma'],

  // Haushalt
  'Kaffeemaschine': ['Bosch', 'Siemens', 'Philips'],
  'Wasserkocher': ['Bosch', 'Siemens', 'Philips', 'WMF'],
  'Staubsauger': ['Bosch', 'Siemens', 'Philips'],
  'Sofa': ['IKEA'],
  'Tisch': ['IKEA'],
  'Stuhl': ['IKEA'],
  'Lampe': ['IKEA', 'Philips'],

  // Sport
  'Laufschuhe': ['Nike', 'Adidas', 'Puma', 'Under Armour', 'Reebok'],
  'Yogamatte': ['Decathlon', 'Reebok'],
  'Hanteln': ['Decathlon', 'Reebok'],
  'Basketball': ['Wilson', 'Spalding', 'Nike'],
  'Fußball': ['Nike', 'Adidas', 'Puma'],
  'Fahrrad': ['Decathlon'],

  // Bücher
  'Roman': ['Penguin', 'Rowohlt', 'Suhrkamp'],
  'Krimi': ['Penguin', 'Rowohlt', 'Suhrkamp'],
  'Kochbuch': ['Rowohlt', 'Carlsen'],

  // Spielzeug
  'Puzzle': ['Ravensburger'],
  'Brettspiel': ['Ravensburger', 'Hasbro', 'Mattel'],
  'Bauklötze': ['LEGO', 'Playmobil', 'Fisher-Price'],
  'Kuscheltier': ['Playmobil', 'Hasbro', 'Mattel', 'Fisher-Price'],

  // Garten
  'Rasenmäher': ['Gardena', 'Bosch', 'Wolf-Garten'],
  'Gartenschere': ['Gardena', 'Fiskars', 'Wolf-Garten'],
  'Blumentopf': ['Gardena', 'IKEA'],
  'Gartenmöbel': ['IKEA', 'Gardena'],

  // Automobile
  'Motoröl': ['Castrol', 'Shell'],
  'Werkzeugset': ['Bosch', '3M'],
  'Dashcam': ['Bosch'],

  // Beauty
  'Shampoo': ['L\'Oréal', 'Nivea', 'Dove', 'Garnier'],
  'Gesichtscreme': ['L\'Oréal', 'Nivea', 'Neutrogena', 'Garnier'],
  'Parfüm': ['L\'Oréal', 'Calvin Klein'],
  'Lippenstift': ['L\'Oréal', 'Maybelline'],
  'Mascara': ['Maybelline', 'L\'Oréal'],

  // Lebensmittel
  'Kaffee': ['Nestlé', 'Jacobs', 'Edeka'],
  'Tee': ['Nestlé', 'Alnatura', 'Edeka'],
  'Schokolade': ['Nestlé', 'Milka', 'Lindt'],
  'Olivenöl': ['Alnatura', 'Edeka', 'Barilla'],
};

// Alle einzigartigen Marken für die Datenbank
const BRANDS = Array.from(new Set(Object.values(PRODUCT_BRAND_MAPPING).flat()));

// Funktion um produktspezifische Beschreibungen zu generieren
function generateProductDescription(template: { name: string }, productName: string, brandName: string): string {
  const descriptions: Record<string, string[]> = {
    'Grafikkarte': [
      `Erleben Sie ultimative Gaming-Performance mit dieser leistungsstarken Grafikkarte. Perfekt für 4K-Gaming und anspruchsvolle Rendering-Aufgaben. Mit modernster Kühltechnologie und RGB-Beleuchtung.`,
      `High-End Grafikkarte für Enthusiasten. Ray-Tracing in Echtzeit, DLSS-Unterstützung und beeindruckende FPS-Zahlen in allen modernen Spielen. Ideal für Content-Creator und Gamer.`,
      `Premium Grafikkarte mit außergewöhnlicher Leistung. Entwickelt für maximale Performance bei Gaming, Streaming und professioneller Arbeit. Inklusive fortschrittlicher Kühllösung.`,
    ],
    'Prozessor': [
      `Hochleistungs-Prozessor der neuesten Generation. Perfekt für Gaming, Content Creation und Multitasking. Übertaktbar für noch mehr Performance.`,
      `Moderne CPU mit beeindruckender Single- und Multi-Core-Performance. Ideal für anspruchsvolle Anwendungen und flüssiges Gaming bei hohen FPS.`,
      `Leistungsstarker Prozessor für Enthusiasten. Optimiert für Gaming und produktive Workloads. Hervorragende Energieeffizienz bei maximaler Leistung.`,
    ],
    'Mainboard': [
      `Premium Mainboard für anspruchsvolle PC-Builds. Modernste Chipsatz-Technologie und umfangreiche Erweiterungsmöglichkeiten. Perfekt für Gaming und Workstations.`,
      `High-End Motherboard mit exzellenter Stromversorgung. Unterstützt die neuesten Prozessoren und RAM-Standards. Ideal für Übertakter und Enthusiasten.`,
      `Robustes Mainboard mit erstklassiger Ausstattung. Zuverlässige Performance und vielfältige Anschlussmöglichkeiten. Für maximale Kompatibilität und Zukunftssicherheit.`,
    ],
    'Laptop': [
      `Premium Laptop für professionelle Anwender. Schlankes Design trifft auf kraftvolle Hardware. Perfekt für unterwegs und im Büro. Lange Akkulaufzeit garantiert.`,
      `Hochleistungs-Notebook mit brillantem Display. Ideal für kreative Arbeiten, Gaming und Business. Erstklassige Verarbeitung und modernste Technologie.`,
      `Mobiler Begleiter für höchste Ansprüche. Kombiniert Portabilität mit Performance. Perfekt ausbalanciert für Arbeit und Entertainment.`,
    ],
    'Smartphone': [
      `Modernste Smartphone-Technologie in elegantem Design. Beeindruckende Kamera, kristallklares Display und blitzschnelle Performance für alle Lebenslagen.`,
      `Premium-Smartphone mit Pro-Kamera-System. Perfekt für Fotos, Videos und mobile Gaming. Langlebiger Akku und 5G-Unterstützung.`,
      `Flaggschiff-Smartphone mit Top-Features. Brillantes Display, leistungsstarker Prozessor und innovative KI-Funktionen für ein smartes Leben.`,
    ],
    'Monitor': [
      `Hochauflösender Monitor für professionelle Anwendungen. Brillante Farben, schnelle Reaktionszeit und ergonomisches Design für stundenlanges Arbeiten.`,
      `Gaming-Monitor mit ultraschneller Bildwiederholrate. G-Sync/FreeSync kompatibel für flüssiges Gameplay ohne Tearing. HDR-Unterstützung für beeindruckende Bilder.`,
      `Premium Display für kreative Profis. Präzise Farbwiedergabe, hohe Auflösung und flexible Anschlussmöglichkeiten. Perfekt für Foto- und Videobearbeitung.`,
    ],
    'Sneaker': [
      `Kultiger Sneaker im zeitlosen Design. Perfekte Kombination aus Style und Komfort. Für jeden Tag und jede Gelegenheit geeignet.`,
      `Premium Sneaker mit ikonischem Look. Hochwertige Materialien und erstklassige Verarbeitung. Ein Must-Have für jeden Sneaker-Fan.`,
      `Lifestyle-Sneaker mit modernem Design. Bequeme Passform und trendiges Aussehen. Ideal für urbane Streetstyle-Looks.`,
    ],
    'Laufschuhe': [
      `Technisch ausgefeilter Laufschuh für ambitionierte Läufer. Optimale Dämpfung, perfekter Halt und reaktionsfreudiges Laufgefühl.`,
      `Performance-Laufschuh mit innovativer Dämpfungstechnologie. Leicht, atmungsaktiv und ideal für lange Distanzen.`,
      `Premium Running-Schuh für maximale Performance. Entwickelt für schnelle Läufe und Wettkämpfe. Hervorragende Energierückgabe.`,
    ],
    'Jeans': [
      `Klassische Jeans im zeitlosen Design. Hochwertige Denim-Qualität und perfekte Passform. Ein Basics-Essential für jede Garderobe.`,
      `Premium Denim mit authentischem Look. Robuster Stoff und komfortable Passform. Vielseitig kombinierbar für jeden Anlass.`,
      `Stilvolle Jeans mit modernem Schnitt. Nachhaltig produziert und langlebig. Perfekter Sitz garantiert.`,
    ],
    'Gürtel': [
      `Eleganter Gürtel aus hochwertigem Material. Zeitloses Design für Business und Freizeit. Robuste Verarbeitung und komfortabler Tragekomfort.`,
      `Premium Ledergürtel mit stilvoller Schnalle. Passt perfekt zu Jeans, Chinos und Anzughosen. Ein unverzichtbares Accessoire für jeden Mann.`,
      `Klassischer Gürtel in erstklassiger Qualität. Langlebig und vielseitig kombinierbar. Perfekter Abschluss für jedes Outfit.`,
    ],
    'Kaffeemaschine': [
      `Hochwertige Kaffeemaschine für perfekten Kaffeegenuss. Einfache Bedienung und konsistente Ergebnisse. Ideal für den täglichen Gebrauch.`,
      `Premium Kaffeevollautomat mit Barista-Qualität. Individuell einstellbar für jeden Geschmack. Perfekter Espresso auf Knopfdruck.`,
      `Moderne Kaffeemaschine mit intelligentem Design. Schnell, zuverlässig und energieeffizient. Für echte Kaffeeliebhaber.`,
    ],
    'Schokolade': [
      `Feinste Schokolade aus hochwertigen Kakaobohnen. Zartschmelzend und intensiv im Geschmack. Ein Genuss für besondere Momente.`,
      `Premium Schokolade mit edlem Charakter. Sorgfältig ausgewählte Zutaten für höchsten Genuss. Perfekt zum Verschenken oder Selbstgenießen.`,
      `Köstliche Schokolade mit cremiger Textur. Ausgewogener Geschmack und nachhaltige Herstellung. Unwiderstehlich lecker.`,
    ],
    'Kaffee': [
      `Aromatischer Kaffee aus sorgfältig ausgewählten Bohnen. Vollmundiger Geschmack und intensives Aroma. Für perfekten Kaffeegenuss.`,
      `Premium Kaffeebohnen mit ausgewogenem Charakter. Schonend geröstet für optimale Aromaentfaltung. Ideal für Espresso und Filterkaffee.`,
      `Exzellenter Kaffee für Kenner. Komplexes Aroma und voller Körper. Nachhaltig angebaut und fair gehandelt.`,
    ],
    'Lippenstift': [
      `Hochwertiger Lippenstift mit intensiver Farbbrillanz. Langanhaltend und pflegend. Für perfekt geschminkte Lippen den ganzen Tag.`,
      `Luxuriöser Lippenstift mit samtigem Finish. Reich an pflegenden Inhaltsstoffen. Verleiht den Lippen Farbe und Feuchtigkeit.`,
      `Premium Lip Color mit brillanter Deckkraft. Komfortables Tragegefühl und langanhaltendes Ergebnis. Must-Have für jede Make-up-Kollektion.`,
    ],
    'Shampoo': [
      `Pflegendes Shampoo für gesundes, glänzendes Haar. Milde Formel für die tägliche Anwendung. Reinigt sanft und versorgt mit Feuchtigkeit.`,
      `Premium Haarpflege mit wirksamen Inhaltsstoffen. Stärkt das Haar von der Wurzel bis zur Spitze. Für sichtbar schöneres Haar.`,
      `Professionelles Shampoo für Salon-Ergebnisse zuhause. Optimale Pflege und Glanz. Dermatologisch getestet.`,
    ],
    'Mascara': [
      `Professionelle Mascara für atemberaubende Wimpern. Intensive Farbe und dramatisches Volumen. Hält den ganzen Tag ohne zu verschmieren.`,
      `Premium Wimperntusche für perfekte Definition. Verlängert und verdichtet die Wimpern. Einfach aufzutragen und leicht zu entfernen.`,
      `Hochwertige Mascara mit innovativer Bürstenform. Erreicht jede Wimper für einen glamourösen Augenaufschlag. Langanhaltend und wischfest.`,
    ],
  };

  const categoryDescriptions = descriptions[template.name] || [
    `Hochwertiges ${template.name} von ${brandName}. Perfekt für den täglichen Gebrauch. Exzellente Qualität und Verarbeitung.`,
    `Premium ${template.name} mit erstklassigen Eigenschaften. Von ${brandName} entwickelt für höchste Ansprüche.`,
    `${brandName} ${template.name} - Eine ausgezeichnete Wahl für Qualitätsbewusste. Überzeugt durch Funktionalität und Design.`,
  ];

  return faker.helpers.arrayElement(categoryDescriptions);
}

// Funktion um eine realistische deutsche Review zu generieren
function generateReview(template: { name: string }, productName: string, brandName: string, userId: number): { userId: number; rating: number; title: string; comment: string; helpful: number } {
  const positiveReviews: Record<string, Array<{ rating: number; title: string; comment: string }>> = {
    'Grafikkarte': [
      { rating: 5, title: 'Absolute Gaming-Maschine!', comment: 'Die Karte läuft selbst bei 4K ultra Settings butterweich. Keine FPS-Drops mehr, selbst bei Cyberpunk. Würde ich sofort wieder kaufen!' },
      { rating: 5, title: 'Top Performance', comment: 'Perfekt für mein Setup. Temperatur bleibt auch unter Last cool. RGB sieht super aus. Lieferung war schnell.' },
      { rating: 4, title: 'Sehr gut, aber laut', comment: 'Performance ist top, keine Frage. Allerdings wird die Karte unter Last schon ziemlich laut. Ansonsten bin ich sehr zufrieden.' },
    ],
    'Prozessor': [
      { rating: 5, title: 'Unglaubliche Performance!', comment: 'CPU ist ein Beast! Spiele laufen butterweich, auch beim Streaming keine Probleme. Top für Gaming und Arbeit!' },
      { rating: 5, title: 'Super CPU', comment: 'Sehr schnell, übertaktet sich super. Temperatur bleibt im grünen Bereich. Definitiv empfehlenswert!' },
      { rating: 4, title: 'Sehr gut', comment: 'Starke Performance für den Preis. Einbau war easy. Hätte mir mehr Kerne gewünscht, aber passt.' },
    ],
    'Mainboard': [
      { rating: 5, title: 'Solides Board!', comment: 'BIOS ist super, viele Einstellungsmöglichkeiten. Alle Anschlüsse die ich brauche. Läuft stabil seit Monaten!' },
      { rating: 5, title: 'Top Qualität', comment: 'Verarbeitung ist erstklassig. RGB-Beleuchtung sieht mega aus. Perfekte Basis für meinen Gaming-PC!' },
      { rating: 4, title: 'Gutes Mainboard', comment: 'Macht alles was es soll. Preis ist fair. Könnte mehr USB-Anschlüsse haben, aber sonst perfekt.' },
    ],
    'Smartphone': [
      { rating: 5, title: 'Bestes Handy bisher!', comment: 'Kamera ist der Wahnsinn! Display absolut brillant, Akku hält locker den ganzen Tag. Bin begeistert!' },
      { rating: 5, title: 'Perfektes Smartphone', comment: 'Sehr schnell, tolle Verarbeitung. Face-ID funktioniert perfekt. Kann ich nur empfehlen!' },
      { rating: 4, title: 'Tolles Gerät', comment: 'Fast alles super, nur der Preis ist schon happig. Aber die Qualität rechtfertigt es.' },
    ],
    'Laptop': [
      { rating: 5, title: 'Perfekt für die Arbeit', comment: 'Super schnell, Display ist gestochen scharf. Akkulaufzeit ist beeindruckend. Genau was ich brauchte!' },
      { rating: 5, title: 'Toller Laptop!', comment: 'Verarbeitung ist top, läuft super leise. Für Office und leichtes Gaming perfekt geeignet.' },
      { rating: 4, title: 'Sehr zufrieden', comment: 'Schneller Laptop mit gutem Display. Touchpad könnte etwas größer sein, aber sonst alles top.' },
    ],
    'Sneaker': [
      { rating: 5, title: 'Mega bequem!', comment: 'Trage die Schuhe jetzt seit 2 Wochen täglich. Null Druckstellen, super Passform. Top!' },
      { rating: 5, title: 'Stylish und komfortabel', comment: 'Sehen richtig gut aus und sind dabei noch bequem. Was will man mehr?' },
      { rating: 4, title: 'Gute Sneaker', comment: 'Qualität ist gut, Design gefällt mir. Fallen etwas klein aus, also lieber eine Nummer größer bestellen.' },
    ],
    'Kaffeemaschine': [
      { rating: 5, title: 'Kaffee wie vom Barista', comment: 'Der Kaffee schmeckt einfach fantastisch! Bedienung ist kinderleicht. Bin total happy damit!' },
      { rating: 5, title: 'Top Maschine!', comment: 'Milchschaum ist perfekt, Kaffee super aromatisch. Reinigung geht schnell. Absolute Kaufempfehlung!' },
      { rating: 4, title: 'Sehr guter Kaffee', comment: 'Kaffeequalität ist exzellent. Maschine ist etwas laut, aber das kann ich verzeihen.' },
    ],
    'Schokolade': [
      { rating: 5, title: 'Unglaublich lecker!', comment: 'Schmeckt einfach himmlisch! Nicht zu süß, perfekte Balance. Kann nicht aufhören zu naschen!' },
      { rating: 5, title: 'Beste Schokolade!', comment: 'Qualität ist spitze, schmilzt auf der Zunge. Perfekt zum Verschenken oder selbst genießen!' },
      { rating: 4, title: 'Sehr gut', comment: 'Leckere Schokolade mit tollem Aroma. Preis ist angemessen für die Qualität.' },
    ],
    'Gürtel': [
      { rating: 5, title: 'Super Qualität!', comment: 'Leder fühlt sich hochwertig an. Schnalle ist robust und sieht edel aus. Passt perfekt!' },
      { rating: 5, title: 'Top Gürtel', comment: 'Sitzt perfekt, Verarbeitung ist erstklassig. Kann man zu allem tragen. Sehr zufrieden!' },
      { rating: 4, title: 'Guter Kauf', comment: 'Schöner Gürtel für den Preis. Material ist gut, könnte etwas weicher sein.' },
    ],
    'Mascara': [
      { rating: 5, title: 'Beste Mascara ever!', comment: 'Wimpern sehen mega lang aus! Hält den ganzen Tag ohne zu krümeln. Absolute Kaufempfehlung!' },
      { rating: 5, title: 'Super Ergebnis', comment: 'Gibt tolles Volumen und Länge. Lässt sich leicht auftragen und gut entfernen. Top!' },
      { rating: 4, title: 'Sehr gut', comment: 'Wimpern werden schön definiert. Preis ist okay. Würde ich wieder kaufen.' },
    ],
  };

  const neutralReviews = [
    { rating: 3, title: 'Geht so', comment: 'Erfüllt seinen Zweck, aber nichts Besonderes. Preis-Leistung ist okay.' },
    { rating: 3, title: 'Durchschnittlich', comment: 'Macht was es soll, aber es gibt bessere Alternativen. Nicht schlecht, aber auch nicht überragend.' },
  ];

  const categoryReviews = positiveReviews[template.name] || [
    { rating: 5, title: 'Sehr zufrieden!', comment: `${brandName} ${template.name} erfüllt voll meine Erwartungen. Qualität ist top, würde ich wieder kaufen!` },
    { rating: 5, title: 'Top Produkt', comment: `Bin sehr happy mit dem ${template.name}. Von ${brandName} wie gewohnt hohe Qualität!` },
    { rating: 4, title: 'Empfehlenswert', comment: `Gutes Produkt zu fairem Preis. Kleine Abstriche in der Verpackung, aber sonst top.` },
  ];

  // Generiere eine Review
  const useNeutral = Math.random() < 0.1; // 10% Chance für neutrale Review
  const reviewTemplate = useNeutral
    ? faker.helpers.arrayElement(neutralReviews)
    : faker.helpers.arrayElement(categoryReviews);

  return {
    userId: userId,
    rating: reviewTemplate.rating,
    title: reviewTemplate.title,
    comment: reviewTemplate.comment,
    helpful: faker.number.int({ min: 0, max: 25 }),
  };
}

// Funktion um produktspezifische Details zu generieren
function generateProductDetails(template: { name: string }, productName: string, brandName: string): Array<{ key: string; value: string }> {
  const baseDetails = [
    { key: 'Marke', value: brandName },
    { key: 'Verfügbarkeit', value: 'Auf Lager' },
    { key: 'Lieferzeit', value: faker.helpers.arrayElement(['1-2 Werktage', '2-3 Werktage', '3-5 Werktage', 'Sofort lieferbar']) },
  ];

  // Spezifische Details basierend auf Produkttyp
  const specificDetails: Record<string, Array<{ key: string; value: string }>> = {
    'Laptop': [
      { key: 'Prozessor', value: faker.helpers.arrayElement(['Intel Core i9', 'Intel Core i7', 'AMD Ryzen 9', 'AMD Ryzen 7', 'Apple M2', 'Apple M3']) },
      { key: 'RAM', value: faker.helpers.arrayElement(['16 GB', '32 GB', '64 GB']) },
      { key: 'Speicher', value: faker.helpers.arrayElement(['512 GB SSD', '1 TB SSD', '2 TB SSD']) },
      { key: 'Display', value: faker.helpers.arrayElement(['15.6" Full HD', '16" WQXGA', '17" 4K']) },
      { key: 'Grafikkarte', value: faker.helpers.arrayElement(['NVIDIA RTX 4060', 'NVIDIA RTX 4070', 'AMD Radeon RX 7700', 'Integriert']) },
      { key: 'Gewicht', value: `${faker.number.float({ min: 1.5, max: 2.8, fractionDigits: 1 })} kg` },
    ],
    'Smartphone': [
      { key: 'Display', value: faker.helpers.arrayElement(['6.1" OLED', '6.4" AMOLED', '6.7" Super Retina']) },
      { key: 'Speicher', value: faker.helpers.arrayElement(['128 GB', '256 GB', '512 GB', '1 TB']) },
      { key: 'RAM', value: faker.helpers.arrayElement(['8 GB', '12 GB', '16 GB']) },
      { key: 'Kamera', value: faker.helpers.arrayElement(['48 MP Hauptkamera', '50 MP Triple-Kamera', '108 MP Quad-Kamera']) },
      { key: 'Akku', value: faker.helpers.arrayElement(['4500 mAh', '5000 mAh', '5500 mAh']) },
      { key: 'Gewicht', value: `${faker.number.int({ min: 170, max: 220 })} g` },
    ],
    'Grafikkarte': [
      { key: 'VRAM', value: faker.helpers.arrayElement(['8 GB GDDR6', '12 GB GDDR6', '16 GB GDDR6X', '24 GB GDDR6X']) },
      { key: 'Boost-Takt', value: `${faker.number.int({ min: 2200, max: 2800 })} MHz` },
      { key: 'TDP', value: `${faker.number.int({ min: 220, max: 450 })} W` },
      { key: 'Anschlüsse', value: faker.helpers.arrayElement(['3x DisplayPort 1.4a, 1x HDMI 2.1', '2x DisplayPort 1.4a, 2x HDMI 2.1']) },
      { key: 'Kühlung', value: faker.helpers.arrayElement(['Triple-Fan', 'Dual-Fan', 'AIO Wasserkühlung']) },
    ],
    'Prozessor': [
      { key: 'Kerne', value: faker.helpers.arrayElement(['6', '8', '12', '16']) },
      { key: 'Threads', value: faker.helpers.arrayElement(['12', '16', '24', '32']) },
      { key: 'Basis-Takt', value: `${faker.number.float({ min: 3.2, max: 4.5, fractionDigits: 1 })} GHz` },
      { key: 'Boost-Takt', value: `${faker.number.float({ min: 4.5, max: 5.8, fractionDigits: 1 })} GHz` },
      { key: 'Cache', value: faker.helpers.arrayElement(['32 MB', '64 MB', '96 MB']) },
      { key: 'TDP', value: `${faker.number.int({ min: 65, max: 125 })} W` },
    ],
    'Monitor': [
      { key: 'Größe', value: faker.helpers.arrayElement(['24"', '27"', '32"', '34"']) },
      { key: 'Auflösung', value: faker.helpers.arrayElement(['1920x1080 (Full HD)', '2560x1440 (QHD)', '3840x2160 (4K)']) },
      { key: 'Panel-Typ', value: faker.helpers.arrayElement(['IPS', 'VA', 'TN', 'OLED']) },
      { key: 'Bildwiederholrate', value: faker.helpers.arrayElement(['60 Hz', '144 Hz', '165 Hz', '240 Hz']) },
      { key: 'Reaktionszeit', value: faker.helpers.arrayElement(['1 ms', '2 ms', '4 ms', '5 ms']) },
    ],
    'Sneaker': [
      { key: 'Material', value: faker.helpers.arrayElement(['Leder', 'Mesh', 'Synthetik', 'Canvas']) },
      { key: 'Sohle', value: faker.helpers.arrayElement(['Gummi', 'EVA-Schaum', 'Boost-Technologie']) },
      { key: 'Größen', value: '36-47' },
      { key: 'Farben', value: faker.helpers.arrayElement(['Schwarz/Weiß', 'Weiß', 'Mehrfarbig', 'Blau/Grau']) },
    ],
    'Jeans': [
      { key: 'Material', value: faker.helpers.arrayElement(['100% Baumwolle', '98% Baumwolle, 2% Elasthan', 'Denim']) },
      { key: 'Schnitt', value: faker.helpers.arrayElement(['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Skinny']) },
      { key: 'Größen', value: 'W28-W40' },
      { key: 'Waschung', value: faker.helpers.arrayElement(['Dark Wash', 'Light Wash', 'Vintage', 'Black']) },
    ],
    'Gürtel': [
      { key: 'Material', value: faker.helpers.arrayElement(['Echtleder', 'Kunstleder', 'Canvas']) },
      { key: 'Breite', value: faker.helpers.arrayElement(['3 cm', '3.5 cm', '4 cm']) },
      { key: 'Länge', value: faker.helpers.arrayElement(['95 cm', '105 cm', '115 cm']) },
      { key: 'Farbe', value: faker.helpers.arrayElement(['Schwarz', 'Braun', 'Cognac', 'Dunkelblau']) },
    ],
    'Kaffeemaschine': [
      { key: 'Typ', value: faker.helpers.arrayElement(['Kapselmaschine', 'Vollautom at', 'Filtermaschine']) },
      { key: 'Fassungsvermögen', value: faker.helpers.arrayElement(['1.2 L', '1.5 L', '1.8 L']) },
      { key: 'Leistung', value: `${faker.number.int({ min: 1200, max: 1500 })} W` },
      { key: 'Druck', value: faker.helpers.arrayElement(['15 bar', '19 bar']) },
    ],
    'Schokolade': [
      { key: 'Kakaoanteil', value: faker.helpers.arrayElement(['30%', '50%', '70%', '85%']) },
      { key: 'Gewicht', value: faker.helpers.arrayElement(['100 g', '200 g', '300 g']) },
      { key: 'Zutaten', value: 'Kakaomasse, Zucker, Kakaobutter, Emulgator' },
      { key: 'Allergene', value: faker.helpers.arrayElement(['Kann Spuren von Nüssen enthalten', 'Milch, Soja']) },
    ],
    'Tablet': [
      { key: 'Display', value: faker.helpers.arrayElement(['10.2" Retina', '11" LCD', '12.9" Liquid Retina']) },
      { key: 'Speicher', value: faker.helpers.arrayElement(['64 GB', '128 GB', '256 GB', '512 GB']) },
      { key: 'RAM', value: faker.helpers.arrayElement(['4 GB', '6 GB', '8 GB']) },
      { key: 'Akku', value: faker.helpers.arrayElement(['7000 mAh', '8000 mAh', '10000 mAh']) },
      { key: 'Gewicht', value: `${faker.number.int({ min: 450, max: 700 })} g` },
    ],
    'Mainboard': [
      { key: 'Sockel', value: faker.helpers.arrayElement(['LGA1700', 'AM5', 'AM4']) },
      { key: 'Chipsatz', value: faker.helpers.arrayElement(['Z790', 'B650', 'X670']) },
      { key: 'RAM-Slots', value: faker.helpers.arrayElement(['4x DDR5', '4x DDR4']) },
      { key: 'Max RAM', value: faker.helpers.arrayElement(['128 GB', '192 GB']) },
      { key: 'Formfaktor', value: faker.helpers.arrayElement(['ATX', 'Micro-ATX', 'Mini-ITX']) },
    ],
    'Tastatur': [
      { key: 'Typ', value: faker.helpers.arrayElement(['Mechanisch', 'Membran', 'Optisch']) },
      { key: 'Switches', value: faker.helpers.arrayElement(['Cherry MX Red', 'Cherry MX Brown', 'Gateron', 'Optical']) },
      { key: 'RGB', value: faker.helpers.arrayElement(['Ja', 'Nein', 'Per-Key RGB']) },
      { key: 'Anschluss', value: faker.helpers.arrayElement(['USB-C', 'USB-A', 'Wireless 2.4GHz', 'Bluetooth']) },
    ],
    'Maus': [
      { key: 'Sensor', value: faker.helpers.arrayElement(['Optisch', 'Laser']) },
      { key: 'DPI', value: faker.helpers.arrayElement(['16000', '25600', '30000']) },
      { key: 'Tasten', value: faker.helpers.arrayElement(['6', '8', '11']) },
      { key: 'Anschluss', value: faker.helpers.arrayElement(['USB', 'Wireless', 'Bluetooth']) },
      { key: 'Gewicht', value: `${faker.number.int({ min: 60, max: 120 })} g` },
    ],
    'Headset': [
      { key: 'Typ', value: faker.helpers.arrayElement(['Over-Ear', 'On-Ear', 'In-Ear']) },
      { key: 'Anschluss', value: faker.helpers.arrayElement(['3.5mm Klinke', 'USB', 'Wireless', 'Bluetooth']) },
      { key: 'Surround', value: faker.helpers.arrayElement(['Stereo', '7.1 Surround', 'Dolby Atmos']) },
      { key: 'Mikrofon', value: 'Integriert, Noise-Cancelling' },
      { key: 'Akkulaufzeit', value: faker.helpers.arrayElement(['20h', '30h', '40h', 'Kabelgebunden']) },
    ],
    'T-Shirt': [
      { key: 'Material', value: faker.helpers.arrayElement(['100% Baumwolle', '95% Baumwolle, 5% Elasthan', 'Polyester']) },
      { key: 'Schnitt', value: faker.helpers.arrayElement(['Regular Fit', 'Slim Fit', 'Oversized']) },
      { key: 'Größen', value: 'XS-XXL' },
      { key: 'Pflege', value: 'Maschinenwäsche 30°C' },
    ],
    'Laufschuhe': [
      { key: 'Sohle', value: faker.helpers.arrayElement(['EVA-Schaum', 'Boost', 'React Foam']) },
      { key: 'Dämpfung', value: faker.helpers.arrayElement(['Hoch', 'Mittel', 'Neutral']) },
      { key: 'Gewicht', value: `${faker.number.int({ min: 220, max: 320 })} g` },
      { key: 'Einsatz', value: faker.helpers.arrayElement(['Training', 'Wettkampf', 'Trail']) },
    ],
    'Kaffee': [
      { key: 'Röstgrad', value: faker.helpers.arrayElement(['Hell', 'Mittel', 'Dunkel']) },
      { key: 'Herkunft', value: faker.helpers.arrayElement(['Brasilien', 'Kolumbien', 'Äthiopien', 'Mischung']) },
      { key: 'Inhalt', value: faker.helpers.arrayElement(['250 g', '500 g', '1000 g']) },
      { key: 'Form', value: faker.helpers.arrayElement(['Ganze Bohnen', 'Gemahlen', 'Kapseln']) },
    ],
    'Tee': [
      { key: 'Sorte', value: faker.helpers.arrayElement(['Schwarztee', 'Grüner Tee', 'Kräutertee', 'Früchtetee']) },
      { key: 'Inhalt', value: faker.helpers.arrayElement(['20 Beutel', '50 g lose', '100 g lose']) },
      { key: 'Bio', value: faker.helpers.arrayElement(['Ja', 'Nein']) },
    ],
    'Lippenstift': [
      { key: 'Finish', value: faker.helpers.arrayElement(['Matt', 'Glänzend', 'Satin', 'Metallic']) },
      { key: 'Haltbarkeit', value: faker.helpers.arrayElement(['Bis zu 8h', 'Bis zu 16h', 'Bis zu 24h']) },
      { key: 'Inhalt', value: '3.5 g' },
      { key: 'Vegan', value: faker.helpers.arrayElement(['Ja', 'Nein']) },
    ],
    'Shampoo': [
      { key: 'Haartyp', value: faker.helpers.arrayElement(['Alle Haartypen', 'Trockenes Haar', 'Fettiges Haar', 'Coloriertes Haar']) },
      { key: 'Inhalt', value: faker.helpers.arrayElement(['250 ml', '400 ml', '500 ml']) },
      { key: 'Silikonfrei', value: faker.helpers.arrayElement(['Ja', 'Nein']) },
      { key: 'pH-Wert', value: faker.helpers.arrayElement(['5.5', '6.0', '6.5']) },
    ],
    'Mascara': [
      { key: 'Typ', value: faker.helpers.arrayElement(['Volumen', 'Länge', 'Definition', 'Wasserfest']) },
      { key: 'Haltbarkeit', value: faker.helpers.arrayElement(['Bis zu 12h', 'Bis zu 24h']) },
      { key: 'Farbe', value: faker.helpers.arrayElement(['Schwarz', 'Braun', 'Blau-Schwarz']) },
      { key: 'Vegan', value: faker.helpers.arrayElement(['Ja', 'Nein']) },
    ],
    'Puzzle': [
      { key: 'Teile', value: faker.helpers.arrayElement(['500', '1000', '1500', '2000']) },
      { key: 'Größe', value: faker.helpers.arrayElement(['50x70 cm', '70x50 cm', '98x75 cm']) },
      { key: 'Altersempfehlung', value: 'Ab 12 Jahren' },
      { key: 'Material', value: 'Hochwertige Pappe' },
    ],
    'Brettspiel': [
      { key: 'Spieler', value: faker.helpers.arrayElement(['2-4', '2-6', '3-8']) },
      { key: 'Spieldauer', value: faker.helpers.arrayElement(['30 Min', '45 Min', '60 Min', '90 Min']) },
      { key: 'Altersempfehlung', value: faker.helpers.arrayElement(['Ab 6 Jahren', 'Ab 8 Jahren', 'Ab 10 Jahren', 'Ab 12 Jahren']) },
      { key: 'Sprache', value: 'Deutsch' },
    ],
  };

  const productDetails = specificDetails[template.name] || [];

  return [...baseDetails, ...productDetails];
}

// Produktvorlagen nach Kategorie mit Suchbegriffen
const PRODUCT_TEMPLATES: Record<string, { name: string; keywords: string[] }[]> = {
  Elektronik: [
    { name: 'Grafikkarte', keywords: ['graphics card gpu', 'nvidia card', 'gaming gpu'] },
    { name: 'Prozessor', keywords: ['computer processor cpu', 'intel chip', 'amd ryzen'] },
    { name: 'Mainboard', keywords: ['motherboard pcb', 'computer board', 'pc motherboard'] },
    { name: 'Laptop', keywords: ['laptop computer', 'notebook pc', 'macbook'] },
    { name: 'Smartphone', keywords: ['smartphone screen', 'mobile phone', 'iphone'] },
    { name: 'Tablet', keywords: ['tablet device', 'ipad screen', 'digital tablet'] },
    { name: 'Monitor', keywords: ['computer monitor', 'display screen', 'gaming monitor'] },
    { name: 'Tastatur', keywords: ['mechanical keyboard', 'gaming keyboard', 'computer keyboard'] },
    { name: 'Maus', keywords: ['gaming mouse', 'computer mouse', 'wireless mouse'] },
    { name: 'Headset', keywords: ['gaming headphones', 'wireless headphones', 'headset'] },
    { name: 'Webcam', keywords: ['webcam', 'video camera', 'streaming camera'] },
    { name: 'Drucker', keywords: ['printer machine', 'office printer', 'inkjet printer'] },
    { name: 'Router', keywords: ['wifi router', 'network router', 'wireless router'] },
  ],
  Mode: [
    { name: 'Sneaker', keywords: ['white sneakers', 'sport shoes', 'running sneakers'] },
    { name: 'T-Shirt', keywords: ['t-shirt white', 'cotton shirt', 'casual tshirt'] },
    { name: 'Hemd', keywords: ['dress shirt', 'formal shirt', 'business shirt'] },
    { name: 'Jeans', keywords: ['blue jeans', 'denim pants', 'jeans trousers'] },
    { name: 'Jacke', keywords: ['winter jacket', 'outdoor jacket', 'sports jacket'] },
    { name: 'Gürtel', keywords: ['leather belt', 'fashion belt', 'mens belt'] },
    { name: 'Stiefel', keywords: ['leather boots', 'winter boots', 'fashion boots'] },
    { name: 'Tasche', keywords: ['leather bag', 'handbag fashion', 'designer bag'] },
    { name: 'Rucksack', keywords: ['travel backpack', 'school backpack', 'hiking backpack'] },
  ],
  Haushalt: [
    { name: 'Kaffeemaschine', keywords: ['coffee machine', 'espresso maker', 'coffee maker'] },
    { name: 'Wasserkocher', keywords: ['electric kettle', 'water kettle', 'tea kettle'] },
    { name: 'Staubsauger', keywords: ['vacuum cleaner', 'robot vacuum', 'hoover'] },
    { name: 'Sofa', keywords: ['modern sofa', 'living room couch', 'leather sofa'] },
    { name: 'Tisch', keywords: ['wooden table', 'dining table', 'modern desk'] },
    { name: 'Stuhl', keywords: ['office chair', 'dining chair', 'modern chair'] },
    { name: 'Lampe', keywords: ['table lamp', 'floor lamp', 'modern light'] },
  ],
  Sport: [
    { name: 'Laufschuhe', keywords: ['running shoes', 'sport sneakers', 'athletic shoes'] },
    { name: 'Yogamatte', keywords: ['yoga mat', 'exercise mat', 'fitness mat'] },
    { name: 'Hanteln', keywords: ['dumbbells weights', 'gym equipment', 'fitness dumbbells'] },
    { name: 'Basketball', keywords: ['basketball ball', 'orange basketball', 'sport ball'] },
    { name: 'Fußball', keywords: ['soccer ball', 'football', 'sport ball'] },
    { name: 'Fahrrad', keywords: ['bicycle', 'mountain bike', 'road bike'] },
  ],
  Bücher: [
    { name: 'Roman', keywords: ['novel book', 'reading book', 'paperback'] },
    { name: 'Krimi', keywords: ['thriller book', 'mystery novel', 'crime book'] },
    { name: 'Kochbuch', keywords: ['cookbook', 'recipe book', 'cooking book'] },
  ],
  Spielzeug: [
    { name: 'Puzzle', keywords: ['jigsaw puzzle', 'puzzle pieces', 'puzzle game'] },
    { name: 'Brettspiel', keywords: ['board game', 'family game', 'tabletop game'] },
    { name: 'Bauklötze', keywords: ['lego blocks', 'building blocks', 'toy blocks'] },
    { name: 'Kuscheltier', keywords: ['teddy bear', 'plush toy', 'stuffed animal'] },
  ],
  Garten: [
    { name: 'Rasenmäher', keywords: ['lawn mower', 'grass cutter', 'garden mower'] },
    { name: 'Gartenschere', keywords: ['pruning shears', 'garden scissors', 'plant cutter'] },
    { name: 'Blumentopf', keywords: ['flower pot', 'plant pot', 'ceramic pot'] },
    { name: 'Gartenmöbel', keywords: ['garden furniture', 'outdoor table', 'patio furniture'] },
  ],
  Automobile: [
    { name: 'Motoröl', keywords: ['motor oil bottle', 'engine oil', 'car oil'] },
    { name: 'Werkzeugset', keywords: ['tool set', 'mechanic tools', 'wrench set'] },
    { name: 'Dashcam', keywords: ['dashcam', 'car camera', 'dashboard camera'] },
  ],
  Beauty: [
    { name: 'Shampoo', keywords: ['shampoo bottle', 'hair care', 'beauty product'] },
    { name: 'Gesichtscreme', keywords: ['face cream jar', 'skincare product', 'moisturizer'] },
    { name: 'Parfüm', keywords: ['perfume bottle', 'fragrance', 'cologne bottle'] },
    { name: 'Lippenstift', keywords: ['lipstick', 'makeup product', 'cosmetic'] },
    { name: 'Mascara', keywords: ['mascara wand', 'eye makeup', 'lash cosmetic'] },
  ],
  Lebensmittel: [
    { name: 'Kaffee', keywords: ['coffee beans', 'roasted coffee', 'coffee bag'] },
    { name: 'Tee', keywords: ['tea leaves', 'tea bag', 'herbal tea'] },
    { name: 'Schokolade', keywords: ['chocolate bar', 'dark chocolate', 'cocoa'] },
    { name: 'Olivenöl', keywords: ['olive oil bottle', 'cooking oil', 'extra virgin oil'] },
  ],
};

// Funktion zum Abrufen eines Pexels-Bildes
async function getPexelsImage(keywords: string[], productName?: string, brandName?: string): Promise<string> {
  if (!pexels) {
    // Fallback auf Picsum wenn kein API Key vorhanden
    return `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`;
  }

  try {
    // Erstelle eine bessere Suchanfrage basierend auf Produktname und Marke
    let query = '';

    if (productName && brandName) {
      // Spezielle Behandlung für bekannte Marken/Produkte
      const productLower = productName.toLowerCase();

      // Apple Produkte
      if (brandName === 'Apple') {
        if (productLower.includes('iphone')) query = 'iphone smartphone';
        else if (productLower.includes('macbook')) query = 'macbook laptop';
        else if (productLower.includes('ipad')) query = 'ipad tablet';
      }
      // Samsung Produkte
      else if (brandName === 'Samsung') {
        if (productLower.includes('galaxy s')) query = 'samsung galaxy smartphone';
        else if (productLower.includes('galaxy tab')) query = 'samsung tablet';
      }
      // NVIDIA/AMD Grafikkarten
      else if (brandName === 'NVIDIA' || brandName === 'AMD') {
        query = 'graphics card gpu';
      }
      // Intel/AMD Prozessoren
      else if ((brandName === 'Intel' || brandName === 'AMD') && (productLower.includes('ryzen') || productLower.includes('core'))) {
        query = 'computer processor cpu';
      }
      // Nike/Adidas Schuhe
      else if ((brandName === 'Nike' || brandName === 'Adidas') && (productLower.includes('air') || productLower.includes('ultra'))) {
        if (productLower.includes('lauf')) query = 'running shoes';
        else query = 'sneakers shoes';
      }
      // Logitech Peripherie
      else if (brandName === 'Logitech') {
        if (productLower.includes('mx')) query = 'computer mouse';
        else if (productLower.includes('g pro') || productLower.includes('g9')) query = 'gaming keyboard';
      }
    }

    // Wenn noch keine spezifische Query, versuche aus Produktnamen zu extrahieren
    if (!query && productName && brandName) {
      const productInfo = productName.replace(brandName, '').trim();
      // Entferne Modellnummern und konzentriere dich auf Produkttyp
      query = productInfo.replace(/\d+/g, '').trim();
    }

    // Wenn immer noch keine Query, verwende Keywords
    if (!query || query.length < 3) {
      query = keywords[0];
    }

    console.log(`    🔍 Suche Bild für: "${query}"`);

    const result = await pexels.photos.search({
      query,
      per_page: 80, // Mehr Ergebnisse für bessere Auswahl
      orientation: 'square',
    });

    if ('photos' in result && result.photos.length > 0) {
      // Wähle ein zufälliges Bild aus den Ergebnissen
      const randomPhoto = faker.helpers.arrayElement(result.photos);
      console.log(`    ✓ Bild gefunden: ${randomPhoto.photographer}`);
      return randomPhoto.src.large;
    } else {
      console.log(`    ⚠️  Keine Bilder für "${query}" gefunden, versuche Fallback...`);

      // Fallback auf ein allgemeineres Keyword
      if (keywords.length > 1) {
        const fallbackQuery = keywords[1];
        const fallbackResult = await pexels.photos.search({
          query: fallbackQuery,
          per_page: 80,
          orientation: 'square',
        });

        if ('photos' in fallbackResult && fallbackResult.photos.length > 0) {
          const randomPhoto = faker.helpers.arrayElement(fallbackResult.photos);
          console.log(`    ✓ Fallback Bild gefunden mit "${fallbackQuery}"`);
          return randomPhoto.src.large;
        }
      }
    }
  } catch (error) {
    console.error('    ❌ Pexels API error:', error);
  }

  // Fallback
  console.log(`    ⚠️  Verwende Placeholder-Bild`);
  return `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/800/800`;
}

// Rate limiting für Pexels API
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🌱 Starting product seed with images...\n');

  if (pexels) {
    console.log('✅ Pexels API aktiv - hochwertige Bilder werden geladen');
    console.log('📊 Limit: 200 Requests/Stunde\n');
  } else {
    console.log('⚠️  Kein Pexels API Key - verwende Placeholder-Bilder');
    console.log('💡 Füge PEXELS_API_KEY in .env hinzu für bessere Bilder\n');
  }

  // Hole verfügbare User für Reviews
  console.log('👥 Fetching users for reviews...');
  const users = await prisma.user.findMany({
    where: { isAdmin: false },
  });

  if (users.length === 0) {
    console.log('⚠️  Keine User gefunden. Bitte erst seed-users.ts ausführen!');
    console.log('💡 Run: npm run db:seed:users\n');
  } else {
    console.log(`  ✓ ${users.length} users gefunden für Reviews\n`);
  }

  // Kategorien erstellen
  console.log('📁 Creating categories...');
  const categories = [];
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        description: cat.description,
      },
    });
    categories.push({ ...category, keywords: cat.keywords });
    console.log(`  ✓ ${category.name}`);
  }

  // Marken erstellen
  console.log('\n🏷️  Creating brands...');
  const brandsMap = new Map<string, any>();
  for (const brandName of BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: {
        name: brandName,
        description: `${brandName} Produkte`,
      },
    });
    brandsMap.set(brandName, brand);
  }
  console.log(`  ✓ Created ${brandsMap.size} brands`);

  // Produkte erstellen
  console.log('\n📦 Creating products with images...');
  let totalProducts = 0;

  for (const category of categories) {
    const templates = PRODUCT_TEMPLATES[category.name] || [];
    const productsPerTemplate = 1; // Nur 1 Produkt pro Template wegen API-Limits (50/Stunde)

    console.log(`\n  📂 ${category.name}:`);

    for (const template of templates) {
      for (let i = 0; i < productsPerTemplate; i++) {
        // Wähle eine passende Marke für dieses spezifische Produkt
        const productBrandNames = PRODUCT_BRAND_MAPPING[template.name] || [];
        if (productBrandNames.length === 0) {
          console.warn(`⚠️  Keine Marken für ${template.name} definiert, überspringe...`);
          continue;
        }
        const brandName = faker.helpers.arrayElement(productBrandNames);
        const brand = brandsMap.get(brandName)!;
        const basePrice = faker.number.float({ min: 9.99, max: 999.99, fractionDigits: 2 });

        // Prüfe ob es spezifische Produktvarianten für diese Marke gibt
        let productName: string;
        const brandSpecificProducts = BRAND_SPECIFIC_PRODUCTS[brandName];
        const specificVariants = brandSpecificProducts?.[template.name];

        if (specificVariants && specificVariants.length > 0) {
          // Verwende spezifische Produktvariante (z.B. "NVIDIA GeForce RTX 4090")
          const variant = faker.helpers.arrayElement(specificVariants);
          productName = `${brandName} ${variant}`;
        } else {
          // Fallback: Generiere Produktname wie vorher
          const adjectives = ['Premium', 'Deluxe', 'Pro', 'Plus', 'Ultra', 'Basic', 'Classic', 'Modern'];
          const colors = ['Schwarz', 'Weiß', 'Rot', 'Blau', 'Grün', 'Grau', 'Silber', 'Gold'];

          productName = `${brand.name} ${template.name}`;

          if (faker.datatype.boolean()) {
            productName = `${brand.name} ${faker.helpers.arrayElement(adjectives)} ${template.name}`;
          }

          if (['Elektronik', 'Haushalt'].includes(category.name) && faker.datatype.boolean()) {
            productName += ` - ${faker.helpers.arrayElement(colors)}`;
          }
        }

        // Bilder mit passenden Keywords abrufen
        const keywords = [...template.keywords, ...category.keywords];
        const previewImage = await getPexelsImage(keywords, productName, brandName);

        // Kurze Pause um API-Limits zu respektieren (200/Stunde = ~2 Sekunden zwischen Requests)
        if (pexels) await delay(2000);

        const image1 = await getPexelsImage(keywords, productName, brandName);
        if (pexels) await delay(2000);

        const image2 = await getPexelsImage(keywords, productName, brandName);
        if (pexels) await delay(2000);

        const image3 = await getPexelsImage(keywords, productName, brandName);

        // Prüfe ob Produkt bereits existiert (basierend auf name + brandId)
        const existingProduct = await prisma.product.findUnique({
          where: {
            name_brandId: {
              name: productName,
              brandId: brand.id,
            },
          },
        });

        if (existingProduct) {
          console.log(`    ⏭️  Überspringe: ${productName.substring(0, 50)}... (existiert bereits)`);
          continue;
        }

        const product = await prisma.product.create({
          data: {
            name: productName,
            description: generateProductDescription(template, productName, brand.name),
            price: basePrice,
            stock: faker.number.int({ min: 0, max: 100 }),
            brandId: brand.id,
            previewImage: previewImage,
            categories: {
              create: {
                categoryId: category.id,
              },
            },
            images: {
              create: [
                { url: image1, index: 0 },
                { url: image2, index: 1 },
                { url: image3, index: 2 },
              ],
            },
            details: {
              create: generateProductDetails(template, productName, brand.name),
            },
          },
        });

        // Erstelle Reviews für das Produkt (wenn User vorhanden)
        if (users.length > 0) {
          // Wähle zufällig 0-3 User für Reviews (manche Produkte haben keine Reviews)
          const numReviewers = faker.number.int({ min: 0, max: Math.min(3, users.length) });
          const selectedUsers = faker.helpers.arrayElements(users, numReviewers);

          for (const user of selectedUsers) {
            const review = generateReview(template, productName, brand.name, user.id);

            await prisma.review.create({
              data: {
                userId: review.userId,
                productId: product.id,
                rating: review.rating,
                title: review.title,
                comment: review.comment,
                helpful: review.helpful,
              },
            });
          }
        }

        totalProducts++;
        console.log(`    ✓ ${productName.substring(0, 50)}...`);
      }
    }
  }

  console.log(`\n✅ Successfully created ${totalProducts} products with images!`);
  console.log(`📁 Categories: ${categories.length}`);
  console.log(`🏷️  Brands: ${brandsMap.size}`);
  console.log('\n💡 Your shop is now ready with realistic product images!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
