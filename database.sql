-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    id integer DEFAULT nextval('users_user_id_seq'::regclass) PRIMARY KEY,
    username character varying(255) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(50),
    admin boolean NOT NULL DEFAULT false
);
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    user_id integer REFERENCES "user"(id),
    trip_name character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    locales text,
    map_locations text,
    date_created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    collaborator integer REFERENCES "user"(id)
);

CREATE TABLE itinerary (
    itinerary_id SERIAL PRIMARY KEY,
    trip_id integer REFERENCES trips(trip_id) ON DELETE CASCADE,
    activity text NOT NULL,
    location character varying(255),
    day date,
    notes text,
    longitude numeric(10,6),
    latitude numeric(10,6),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE packinglist (
    packinglist_id integer DEFAULT nextval('packinglist_item_id_seq'::regclass) PRIMARY KEY,
    item_name character varying(255),
    quantity integer DEFAULT 1,
    packed boolean DEFAULT false,
    day date,
    item_id integer REFERENCES items(item_id) ON DELETE CASCADE ON UPDATE CASCADE,
    trip_id integer REFERENCES trips(trip_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    item_name character varying(255) NOT NULL,
    category character varying(50) DEFAULT 'summer'::character varying,
    user_id integer REFERENCES "user"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE collaborators (
  id SERIAL PRIMARY KEY,
  trip_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  FOREIGN KEY (trip_id) REFERENCES "trips"(trip_id),
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);


CREATE TABLE trip_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

ALTER TABLE trips ADD COLUMN category_id INTEGER REFERENCES trip_categories(category_id);

INSERT INTO trip_categories (category_name)
VALUES
    ('Beach'),
    ('Mountains'),
    ('Cityscape'),
    ('Road Trip/Highway'),
    ('Desert'),
    ('Forest'),
    ('Countryside/Farmland'),
    ('Tropical Island'),
    ('Winter Wonderland'),
    ('Historical/Landmarks');