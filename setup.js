const database = require('./database');

// Cache emojis so we don't have to spam the api
database.prepare(`
    CREATE TABLE IF NOT EXISTS cache (
        emoji_id TEXT PRIMARY KEY,
        emoji_name TEXT,
        tier INTEGER,
        health INTEGER,
        damage INTEGER,
        bio TEXT,
        ability_name TEXT,
        ability_bio TEXT,
        animated INTEGER
    )
`).run();

// Stores user data
database.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,  
        emoji_id TEXT,
        pet_name TEXT,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0
    )
`).run();
