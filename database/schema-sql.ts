/**
 * SQL tạo schema database (dùng chung cho migrate script và auto-repair runtime).
 *
 * Tách riêng khỏi `scripts/migrate.ts` để `database/db.ts` có thể tự tạo lại
 * schema khi PGlite local bị hỏng (ví dụ: bị kill đột ngột làm hỏng WAL).
 */

/** Enum types của schema. */
export const ENUM_SQL = `
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin','editor','customer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending','confirmed','shipping','delivered','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cod','bank_transfer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('unpaid','paid','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('active','hidden','draft');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE search_intent AS ENUM ('informational','commercial','transactional','navigational');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE keyword_priority AS ENUM ('low','medium','high','top');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE backlink_type AS ENUM ('editorial','guest_post','directory','forum','social','press','other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE backlink_status AS ENUM ('pending','active','rejected','removed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE seo_audit_status AS ENUM ('pass','warning','error');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE seo_event_type AS ENUM ('page_view','view_item','search','add_to_cart','begin_checkout','purchase');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`;

/** Bảng + index của schema. */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(160) NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  phone VARCHAR(24),
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_verified_at TIMESTAMPTZ,
  email_verify_token TEXT,
  email_verify_expires_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (lower(email));
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(24);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_expires_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS users_verify_token_idx ON users (email_verify_token);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(24) NOT NULL,
  email VARCHAR(160),
  address TEXT NOT NULL,
  ward VARCHAR(120),
  district VARCHAR(120),
  city VARCHAR(120),
  note TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  logo_url TEXT,
  description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_title VARCHAR(200),
  seo_description VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS brands_slug_unique ON brands (slug);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  icon VARCHAR(60),
  position INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_title VARCHAR(200),
  seo_description VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique ON categories (slug);
CREATE INDEX IF NOT EXISTS categories_parent_idx ON categories (parent_id);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL,
  sku VARCHAR(60) NOT NULL,
  short_description VARCHAR(320),
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  sale_price NUMERIC(12,2),
  cost_price NUMERIC(12,2),
  image_url TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}'::text[],
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  sold_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  rating_average NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  badge VARCHAR(40),
  status product_status NOT NULL DEFAULT 'active',
  specs TEXT,
  faq TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  seo_title VARCHAR(200),
  seo_description VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products (slug);
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique ON products (sku);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON products (brand_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (status);
CREATE INDEX IF NOT EXISTS products_price_idx ON products (price);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (is_featured);

CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  author_name VARCHAR(120) NOT NULL,
  rating INTEGER NOT NULL,
  title VARCHAR(200),
  content TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reviews_product_idx ON product_reviews (product_id);
CREATE INDEX IF NOT EXISTS reviews_customer_idx ON product_reviews (customer_id);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(32) NOT NULL,
  customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(24) NOT NULL,
  email VARCHAR(160),
  address TEXT NOT NULL,
  note TEXT,
  payment_method payment_method NOT NULL DEFAULT 'cod',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  status order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12,2) NOT NULL,
  shipping_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS orders_code_unique ON orders (order_code);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(220) NOT NULL,
  product_slug VARCHAR(240),
  product_image TEXT,
  sku VARCHAR(60),
  unit_price NUMERIC(12,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total NUMERIC(12,2) NOT NULL
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON order_items (product_id);

CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(40) NOT NULL,
  description VARCHAR(200),
  type VARCHAR(20) NOT NULL DEFAULT 'percent',
  value NUMERIC(12,2) NOT NULL,
  min_order_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  max_discount NUMERIC(12,2),
  usage_limit INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(240) NOT NULL,
  slug VARCHAR(260) NOT NULL,
  excerpt VARCHAR(400),
  content TEXT NOT NULL,
  cover_image TEXT,
  cover_alt VARCHAR(200),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  author_name VARCHAR(120) NOT NULL DEFAULT 'TechZone',
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  is_published BOOLEAN NOT NULL DEFAULT true,
  reading_time INTEGER NOT NULL DEFAULT 4,
  view_count INTEGER NOT NULL DEFAULT 0,
  seo_title VARCHAR(200),
  seo_description VARCHAR(320),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS blog_slug_unique ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_published_idx ON blog_posts (is_published, published_at);

CREATE TABLE IF NOT EXISTS keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  intent search_intent NOT NULL DEFAULT 'commercial',
  topic_group VARCHAR(120) NOT NULL DEFAULT 'Chung',
  target_url VARCHAR(300) NOT NULL,
  priority keyword_priority NOT NULL DEFAULT 'medium',
  search_volume INTEGER,
  difficulty INTEGER,
  position INTEGER,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS keywords_slug_unique ON keywords (slug);
CREATE INDEX IF NOT EXISTS keywords_intent_idx ON keywords (intent);
CREATE INDEX IF NOT EXISTS keywords_group_idx ON keywords (topic_group);

CREATE TABLE IF NOT EXISTS social_profiles (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(40) NOT NULL,
  url VARCHAR(400) NOT NULL,
  handle VARCHAR(120),
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS social_platform_unique ON social_profiles (platform);

CREATE TABLE IF NOT EXISTS backlinks (
  id SERIAL PRIMARY KEY,
  source_url VARCHAR(600) NOT NULL,
  target_url VARCHAR(600) NOT NULL,
  anchor_text VARCHAR(200),
  domain VARCHAR(255) NOT NULL,
  domain_authority INTEGER,
  type backlink_type NOT NULL DEFAULT 'editorial',
  status backlink_status NOT NULL DEFAULT 'pending',
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS backlinks_domain_idx ON backlinks (domain);
CREATE INDEX IF NOT EXISTS backlinks_status_idx ON backlinks (status);

CREATE TABLE IF NOT EXISTS seo_audits (
  id SERIAL PRIMARY KEY,
  url VARCHAR(600) NOT NULL,
  page_type VARCHAR(60) NOT NULL DEFAULT 'page',
  check_name VARCHAR(80) NOT NULL,
  status seo_audit_status NOT NULL DEFAULT 'pass',
  message TEXT,
  severity INTEGER NOT NULL DEFAULT 0,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS seo_audits_url_idx ON seo_audits (url);
CREATE INDEX IF NOT EXISTS seo_audits_status_idx ON seo_audits (status);

CREATE TABLE IF NOT EXISTS seo_events (
  id SERIAL PRIMARY KEY,
  type seo_event_type NOT NULL,
  path VARCHAR(400) NOT NULL,
  label VARCHAR(240),
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  value NUMERIC(12,2) NOT NULL DEFAULT 0,
  session_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS seo_events_type_idx ON seo_events (type);
CREATE INDEX IF NOT EXISTS seo_events_created_idx ON seo_events (created_at);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(24),
  subject VARCHAR(200),
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contact_created_idx ON contact_messages (created_at);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(80) NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS settings_key_unique ON settings (key);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(60) NOT NULL DEFAULT 'Mặc định',
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(24) NOT NULL,
  address TEXT NOT NULL,
  ward VARCHAR(120),
  district VARCHAR(120),
  city VARCHAR(120),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS addresses_user_idx ON customer_addresses (user_id);
CREATE INDEX IF NOT EXISTS addresses_default_idx ON customer_addresses (user_id, is_default);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_product_unique ON wishlist_items (user_id, product_id);
CREATE INDEX IF NOT EXISTS wishlist_user_idx ON wishlist_items (user_id);
`;
