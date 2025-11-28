import { useDB } from '../utils/db';

export default defineNitroPlugin((nitroApp) => {
  const db = useDB();

  const schema = `
    -- Roles Table
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles (id)
    );

    -- Photographers Table
    CREATE TABLE IF NOT EXISTS photographers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      location TEXT,
      bio TEXT,
      profile_picture TEXT,
      category TEXT, -- e.g., Wedding, Product, Event
      tags TEXT, -- Comma-separated tags
      hourly_rate REAL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    -- Clients Table
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    -- Portfolios Table
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photographer_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (photographer_id) REFERENCES photographers (id)
    );

    -- Portfolio Images Table
    CREATE TABLE IF NOT EXISTS portfolio_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY (portfolio_id) REFERENCES portfolios (id)
    );

    -- Service Packages Table
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photographer_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      deliverables TEXT,
      FOREIGN KEY (photographer_id) REFERENCES photographers (id)
    );

    -- Bookings Table
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      photographer_id INTEGER NOT NULL,
      package_id INTEGER NOT NULL,
      booking_date DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled
      custom_request TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients (id),
      FOREIGN KEY (photographer_id) REFERENCES photographers (id),
      FOREIGN KEY (package_id) REFERENCES packages (id)
    );

    -- Reviews Table
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER NOT NULL UNIQUE,
      client_id INTEGER NOT NULL,
      photographer_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings (id),
      FOREIGN KEY (client_id) REFERENCES clients (id),
      FOREIGN KEY (photographer_id) REFERENCES photographers (id)
    );

    -- Availability Table for Photographers
    CREATE TABLE IF NOT EXISTS photographer_availability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photographer_id INTEGER NOT NULL,
      date TEXT NOT NULL, -- YYYY-MM-DD
      is_unavailable BOOLEAN DEFAULT 0,
      UNIQUE(photographer_id, date),
      FOREIGN KEY (photographer_id) REFERENCES photographers (id)
    );

    -- Insert default roles if they don't exist
    INSERT OR IGNORE INTO roles (id, name) VALUES (1, 'client');
    INSERT OR IGNORE INTO roles (id, name) VALUES (2, 'photographer');

    -- Dummy Users
    -- Passwords are 'password'
    INSERT OR IGNORE INTO users (id, email, password, role_id) VALUES (1, 'john@doe.com', '5f4dcc3b5aa765d61d8327deb882cf99:e2c7a6e1f6e2e2b3e8e2b8c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9', 2);
    INSERT OR IGNORE INTO users (id, email, password, role_id) VALUES (2, 'jane@doe.com', '5f4dcc3b5aa765d61d8327deb882cf99:e2c7a6e1f6e2e2b3e8e2b8c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9', 2);
    INSERT OR IGNORE INTO users (id, email, password, role_id) VALUES (3, 'client@test.com', '5f4dcc3b5aa765d61d8327deb882cf99:e2c7a6e1f6e2e2b3e8e2b8c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9d2c9e4e2b8c9', 1);

    -- Dummy Photographers
    INSERT OR IGNORE INTO photographers (user_id, name, location, bio, profile_picture, category, tags, hourly_rate) VALUES (1, 'John Doe', 'New York, NY', 'Specializing in breathtaking wedding and event photography.', '/photographers/john-doe.jpg', 'Wedding', 'wedding,portrait,events', 150);
    INSERT OR IGNORE INTO photographers (user_id, name, location, bio, profile_picture, category, tags, hourly_rate) VALUES (2, 'Jane Smith', 'Los Angeles, CA', 'Creative product and commercial photographer with an eye for detail.', '/photographers/jane-smith.jpg', 'Product', 'commercial,product,studio', 200);
  `;

  try {
    db.exec(schema);
    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
});
