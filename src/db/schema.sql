-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  email VARCHAR(255) PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  dob DATE NOT NULL
);

-- Work table
CREATE TABLE IF NOT EXISTS work (
  id INT AUTO_INCREMENT PRIMARY KEY,
  participant_email VARCHAR(255),
  companyname VARCHAR(255) NOT NULL,
  salary DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  FOREIGN KEY (participant_email) REFERENCES participants(email) ON DELETE CASCADE
);

-- Home table
CREATE TABLE IF NOT EXISTS home (
  id INT AUTO_INCREMENT PRIMARY KEY,
  participant_email VARCHAR(255),
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  FOREIGN KEY (participant_email) REFERENCES participants(email) ON DELETE CASCADE
);
