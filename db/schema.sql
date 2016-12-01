DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS que;

CREATE TABLE djs(
  id SERIAL PRIMARY KEY,
  first_name varchar(250) NOT NULL,
  last_name varchar(250) NOT NULL,
  email varchar(250) NOT NULL UNIQUE,
  image varchar(250),
  bio varchar(250),
  location varchar(250) NOT NULL,
  password varchar(250) NOT NULL,
  events varchar(250),
  type varchar(3) NOT NULL,
  upvotes integer,
  downvotes integer
);

CREATE TABLE fans(
  id SERIAL PRIMARY KEY,
  first_name varchar(250) NOT NULL,
  last_name varchar(250) NOT NULL,
  email varchar(250) NOT NULL UNIQUE,
  image varchar(250),
  bio varchar(250),
  location varchar(250) NOT NULL,
  password varchar(250) NOT NULL,
  events varchar(250),
  type varchar(3) NOT NULL,
  upvotes integer,
  downvotes integer
);

CREATE TABLE que (
  id SERIAL PRIMARY KEY,
  title varchar(250) NOT NULL,
  artist varchar(250) NOT NULL,
  img varchar(250) NOT NULL,
  djs_id integer REFERENCES djs(id),
  fans_id integer REFERENCES fans(id)
);
