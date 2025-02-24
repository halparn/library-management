-- Create Database
CREATE DATABASE library_db;

-- Connect to library_db
\c library_db;

-- Create Tables
CREATE TABLE IF NOT EXISTS "User" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Book" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "author" VARCHAR(255) NOT NULL,
  "year" INTEGER NOT NULL,
  "userId" INTEGER REFERENCES "User"(id)
);

CREATE TABLE IF NOT EXISTS "BorrowHistory" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER REFERENCES "User"(id) NOT NULL,
  "bookId" INTEGER REFERENCES "Book"(id) NOT NULL,
  "borrowedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "returnedAt" TIMESTAMP,
  "score" INTEGER CHECK (score >= 0 AND score <= 10)
);

-- Insert sample data
INSERT INTO "User" ("name") VALUES
  ('John Doe'),
  ('Jane Smith');

-- Add users with Turkish names
INSERT INTO "User" (name) VALUES
  ('Ahmet Yılmaz'),
  ('Zeynep Kaya'),
  ('Mehmet Demir'),
  ('Ayşe Çelik'),
  ('Mustafa Öztürk'),
  ('Elif Yıldız'),
  ('Can Aksoy'),
  ('Deniz Aydın'),
  ('Ece Erdoğan'),
  ('Burak Özdemir'),
  ('Selin Şahin'),
  ('Emre Koç'),
  ('İrem Arslan'),
  ('Onur Çetin'),
  ('Defne Doğan'),
  ('Kerem Yalçın'),
  ('Nil Güneş'),
  ('Arda Korkmaz'),
  ('Ceren Özer'),
  ('Kaan Şener'),
  ('Yağmur Kılıç'),
  ('Mert Aktaş'),
  ('Derin Altın'),
  ('Berk Taşkın'),
  ('Aslı Güler'),
  ('Ege Demirci'),
  ('Yaren Tunç'),
  ('Alp Sarı'),
  ('Eylül Avcı'),
  ('Çınar Yüksel');

-- Initial data: Books
INSERT INTO "Book" (name, author, year) VALUES
  ('Heart of Darkness', 'Joseph Conrad', 1899),
  ('Lord of The Rings', 'J.R.R. Tolkien', 1954),
  ('Light in August', 'William Faulkner', 1932),
  ('One Hundred Years of Solitude', 'Gabriel García Márquez', 1967),
  ('The Wise Man''s Fear', 'Patrick Rothfuss', 2011),
  ('Martin Eden', 'Jack London', 1909),
  ('Crime and Punishment', 'Fyodor Dostoevsky', 1866),
  ('Foundation', 'Isaac Asimov', 1951),
  ('Do Androids Dream of Electric Sheep?', 'Philip K. Dick', 1968),
  ('Gece', 'Bilge Karasu', 1985),
  ('Kaplan, Kaplan!', 'Bilge Karasu', 1978),
  ('In Search of Lost Time', 'Marcel Proust', 1913),
  ('The Metamorphosis', 'Franz Kafka', 1915),
  ('The Name of the Wind', 'Patrick Rothfuss', 2007),
  ('The Hobbit', 'J.R.R. Tolkien', 1937),
  ('The Silmarillion', 'J.R.R. Tolkien', 1977),
  ('Notes from Underground', 'Fyodor Dostoevsky', 1864),
  ('The Brothers Karamazov', 'Fyodor Dostoevsky', 1879),
  ('Foundation and Empire', 'Isaac Asimov', 1952),
  ('Second Foundation', 'Isaac Asimov', 1953),
  ('Neuromancer', 'William Gibson', 1984),
  ('Blade Runner', 'Philip K. Dick', 1968),
  ('Love in the Time of Cholera', 'Gabriel García Márquez', 1985),
  ('The Sound and the Fury', 'William Faulkner', 1929),
  ('The Trial', 'Franz Kafka', 1925),
  ('The Castle', 'Franz Kafka', 1926),
  ('White Nights', 'Fyodor Dostoevsky', 1848),
  ('Dune', 'Frank Herbert', 1965),
  ('Brave New World', 'Aldous Huxley', 1932),
  ('The Call of the Wild', 'Jack London', 1903),
  ('Nostromo', 'Joseph Conrad', 1904),
  ('Chronicle of a Death Foretold', 'Gabriel García Márquez', 1981);

-- Add borrow history records
INSERT INTO "BorrowHistory" ("userId", "bookId", "borrowedAt", "returnedAt", "score")
VALUES 
  (1, 1, NOW() - INTERVAL '30 days', NOW() - INTERVAL '20 days', 8),
  (2, 4, NOW() - INTERVAL '5 days', NULL, NULL); -- Add history for Brave New World

-- Set current borrowed book (after adding borrow history)
UPDATE "Book" SET "userId" = 2 WHERE name = 'Brave New World'; 