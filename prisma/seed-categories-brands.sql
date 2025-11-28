-- SQL Script zum Einfügen von Test-Kategorien und Marken
-- Ausführen mit: psql -U postgres -d HansPeter -f prisma/seed-categories-brands.sql

-- Categories einfügen
INSERT INTO "Category" (name, description, "createdAt", "updatedAt")
VALUES
  ('Elektronik', 'Elektronische Geräte und Zubehör', NOW(), NOW()),
  ('Kleidung', 'Mode und Bekleidung für alle', NOW(), NOW()),
  ('Bücher', 'Bücher und E-Books aller Genres', NOW(), NOW()),
  ('Spielzeug', 'Spielzeug für Kinder aller Altersgruppen', NOW(), NOW()),
  ('Sport', 'Sportausrüstung und Fitnessgeräte', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Brands einfügen
INSERT INTO "Brand" (name, description, "createdAt", "updatedAt")
VALUES
  ('TechPro', 'Premium Elektronik-Hersteller', NOW(), NOW()),
  ('StyleWear', 'Moderne Mode für jeden Anlass', NOW(), NOW()),
  ('BookMaster', 'Qualitätsbücher seit 1995', NOW(), NOW()),
  ('PlayTime', 'Sicheres und pädagogisches Spielzeug', NOW(), NOW()),
  ('SportMax', 'Professionelle Sportausrüstung', NOW(), NOW()),
  ('Generic Brand', 'Zuverlässige Produkte für jeden Tag', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

SELECT 'Categories und Brands erfolgreich eingefügt!' as message;

