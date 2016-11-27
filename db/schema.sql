DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS que;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  image varchar(250) NOT NULL,
  bio varchar(250) NOT NULL,
  location varchar(250) NOT NULL,
  events varchar(250) NOT NULL,
  type varchar(3) NOT NULL,
  upvotes integer NOT NULL,
  downvotes integer NOT NULL
);

CREATE TABLE que (
  id SERIAL PRIMARY KEY,
  title varchar(250) NOT NULL,
  artist varchar(250) NOT NULL,
  img varchar(250) NOT NULL,
  que_id integer REFERENCES users(id)
);
