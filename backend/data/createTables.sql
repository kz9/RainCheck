CREATE TABLE cities (
	zipcode TEXT NOT NULL PRIMARY KEY,
	city TEXT NOT NULL,
	state TEXT NOT NULL
);

CREATE TABLE users (
    email TEXT NOT NULL PRIMARY KEY,
    phone INTEGER,
    zipcode TEXT NOT NULL
);

CREATE TABLE weather(
    zipcode TEXT NOT NULL PRIMARY KEY,
    pop REAL NOT NULL,
    temp REAL NOT NULL,
    name TEXT NOT NULL
);
